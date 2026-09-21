import re

with open('index.js', 'r') as f:
    code = f.read()

# 1. Update startApplyWorkers call in index.js to include preflightJob
old_start_workers = """  applyWorkerController = startApplyWorkers({
    queue: applyQueue,
    executeJob: executeQueuedApply,
    audit,
    concurrency: maxConcurrent,
    pollMs: 2000,
    applyTimeoutMs: APPLY_TIMEOUT_MS,"""

new_start_workers = """  applyWorkerController = startApplyWorkers({
    queue: applyQueue,
    executeJob: executeQueuedApply,
    preflightJob: async (job) => {
      const chatId = Number(job.telegram_chat_id);
      const precheck = await prevalidateJob(chatId, { url: job.url, title: 'Job' });
      if (!precheck.ok) {
        await saveAppliedJob(chatId, job.url, precheck.jobName || 'Unknown Job', 'failed', precheck.reason);
        throw new Error(`preflight_failed: ${precheck.reason}`);
      }
    },
    audit,
    concurrency: maxConcurrent,
    pollMs: 2000,
    applyTimeoutMs: APPLY_TIMEOUT_MS,"""

code = code.replace(old_start_workers, new_start_workers)


# 2. Rewrite the loop part inside runJobsLoop
# We need to replace the entire `for (const job of jobs) { ... }` up to `const activeClientJob = `

old_runjobs_loop_start = "    if (jobs.length > 0 || consecutiveEmptyPolls === 0) {"
old_runjobs_loop_end = """    const activeClientJob = clientId
      ? await applyQueue.hasActiveClientJob(clientId)
      : false;"""

# Extract the chunk exactly
start_idx = code.find(old_runjobs_loop_start)
end_idx = code.find(old_runjobs_loop_end)

if start_idx == -1 or end_idx == -1:
    print("Could not find boundaries for replacing runJobsLoop body.")
    exit(1)

old_chunk = code[start_idx:end_idx]

new_chunk = """    if (jobs.length > 0 || consecutiveEmptyPolls === 0) {
      if (jobs.length > 0) console.log(`[User ${chatId}] Processing ${jobs.length} unhandled jobs for preflight. AWL ID: '${applyProfile.applywizz_id}'`);
    }
    
    // Scanner Phase: Dump all new jobs into the preflight queue
    for (const job of jobs) {
      if (!state.jobRunnerActive || state.runGeneration !== runGeneration) break;
      if (!clientId) continue;
      if (String(job.applywizzId || '') !== String(applyProfile.applywizz_id || '')) {
        console.log(`[User ${chatId}] Skipping ${job.url}: applywizz_id mismatch.`);
        continue;
      }
      
      try {
        await applyQueue.enqueueApplyJob({
          clientId,
          telegramChatId: chatId,
          jobId: job.id,
          url: job.url,
          status: 'preflight_queued',
          availableAt: new Date().toISOString()
        });
      } catch (err) {
        console.error(`[User ${chatId}] Failed to enqueue preflight for ${job.url}:`, err.message);
      }
    }

    // Prompter Phase: Check if we are ready to prompt the user
    if (!state.currentPromptToken && state.jobRunnerActive && state.runGeneration === runGeneration) {
      if (clientId) {
        const readyJobs = await applyQueue.getReadyPreflightPassedJobs(clientId);
        if (readyJobs.length > 0) {
          const job = readyJobs[0];
          const url = job.url;
          
          if (!state.sessionStartedAt) {
            state.sessionStartedAt = Date.now();
            state.sessionDeadline = state.sessionStartedAt + SESSION_MS;
            state.consecutiveNoCount = 0;
            await persistWorkflowState(chatId, state);
            await audit(chatId, 'session_started', {
              startedAt: new Date(state.sessionStartedAt).toISOString(),
              deadlineAt: new Date(state.sessionDeadline).toISOString(),
            });
          }

          offeredAny = true;
          const promptToken = crypto.randomUUID();
          state.pendingJobUrl[promptToken] = url;
          const promptSentAt = Date.now();
          const promptExpiresAt = Math.min(state.sessionDeadline, promptSentAt + DECISION_TIMEOUT_MS);
          
          state.currentPromptToken = promptToken;
          state.currentPromptUrl = url;
          state.currentPromptSentAt = promptSentAt;
          state.currentPromptExpiresAt = promptExpiresAt;
          
          await workflowStateStore.recordPrompt(chatId, {
            token: promptToken,
            url,
            sentAt: promptSentAt,
            expiresAt: promptExpiresAt,
          });
          await persistWorkflowState(chatId, state);
          await audit(chatId, 'job_prompt_sent', { url, expiresAt: promptExpiresAt });
          await audit(chatId, 'prompt_timer_started', {
            url,
            startedAt: new Date(promptSentAt).toISOString(),
            expiresAt: new Date(promptExpiresAt).toISOString(),
            durationMs: promptExpiresAt - promptSentAt,
          });
          
          await applyQueue.updateJobStatus(job.id, 'prompt_sent');

          let promptText = 'New Job Passed Pre-Flight:\n';
          promptText += `Link: ${url}\n\nDo you want to apply?`;

          await sendMessageWithButtons(chatId, promptText, [
            [{ text: '✅ Yes', callback_data: `job_yes_${promptToken}` }],
            [{ text: '❌ No', callback_data: `job_no_${promptToken}` }],
          ]);

          const decisionWaitMs = Math.min(DECISION_TIMEOUT_MS, Math.max(0, state.sessionDeadline - promptSentAt));
          const response = await waitForDecision(chatId, decisionWaitMs);
          
          if (state.runGeneration === runGeneration) {
            const clickAt = response.clickedAt || Date.now();

            state.currentPromptToken = null;
            state.currentPromptUrl = null;
            state.currentPromptSentAt = null;
            state.currentPromptExpiresAt = null;

            await audit(chatId, response.decision === null ? 'job_missed' : response.decision ? 'job_yes' : 'job_no', {
              url,
              clickedAt: new Date(clickAt).toISOString(),
            });
            await persistWorkflowState(chatId, state, {
              current_prompt_token: null,
              current_prompt_url: null,
              current_prompt_sent_at: null,
              current_prompt_expires_at: null,
              last_decision: response.decision === null ? 'missed' : response.decision ? 'yes' : 'no',
              last_decision_at: new Date(clickAt).toISOString(),
            });

            if (response.decision === null) {
              await saveAppliedJob(chatId, url, 'Job missed', 'missed', 'timeout');
              await applyQueue.updateJobStatus(job.id, 'failed', { last_error: 'timeout' });
              await sendMessage(chatId, 'Job missed');
              state.nextScanAt = Math.min(state.sessionDeadline, promptSentAt + DECISION_TIMEOUT_MS + NEXT_LINK_DELAY_MS);
              await persistWorkflowState(chatId, state);
              await audit(chatId, 'next_link_scheduled', { reason: 'job_missed', scheduledAt: new Date(state.nextScanAt).toISOString(), delayMs: state.nextScanAt - Date.now() });
            } else if (!response.decision) {
              await saveAppliedJob(chatId, url, 'Skipped by user', 'rejected', 'user_clicked_no');
              await applyQueue.updateJobStatus(job.id, 'failed', { last_error: 'user_clicked_no' });
              await sendMessage(chatId, 'response noted-no');
              state.consecutiveNoCount += 1;
              if (state.consecutiveNoCount >= 3) {
                state.consecutiveNoCount = 0;
                state.nextScanAt = Math.min(state.sessionDeadline, clickAt + NEXT_LINK_DELAY_MS);
              } else {
                state.nextScanAt = clickAt;
              }
              await persistWorkflowState(chatId, state);
              await audit(chatId, 'next_link_scheduled', { reason: state.consecutiveNoCount === 0 ? 'third_no' : 'no_response', scheduledAt: new Date(state.nextScanAt).toISOString(), delayMs: Math.max(0, state.nextScanAt - Date.now()) });
            } else {
              state.consecutiveNoCount = 0;
              await sendMessage(chatId, 'response noted-yes');
              const availableAt = Date.now() + randomMinutes(15, 20);
              console.log(`[User ${chatId}] Yes accepted; automation available at ${new Date(availableAt).toISOString()}`);
              await audit(chatId, 'automation_delay_started', { url, startedAt: new Date().toISOString(), availableAt: new Date(availableAt).toISOString(), delayMs: availableAt - Date.now() });
              
              await applyQueue.updateJobStatus(job.id, 'queued', { available_at: new Date(availableAt).toISOString() });
              await audit(chatId, 'job_queued', { url, queueId: job.id, availableAt });
              
              const activeClientJob = await applyQueue.hasActiveClientJob(clientId);
              if (activeClientJob) {
                await sendMessage(chatId, 'An application for this client is already running. I’ll offer the next job once it finishes.');
              }
              state.nextScanAt = Math.min(state.sessionDeadline, clickAt + NEXT_LINK_DELAY_MS);
              await persistWorkflowState(chatId, state);
              await audit(chatId, 'next_link_scheduled', { reason: 'yes', scheduledAt: new Date(state.nextScanAt).toISOString(), delayMs: Math.max(0, state.nextScanAt - Date.now()) });
            }
          }
        }
      }
    }

"""

code = code[:start_idx] + new_chunk + code[end_idx:]

with open('index.js', 'w') as f:
    f.write(code)

print("Patched index.js successfully.")
