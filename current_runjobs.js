async function runJobsLoop(chatId) {
  const state = stateFor(chatId);
  try {
    await hydrateWorkflowState(chatId);
  } catch (error) {
    console.error(`[User ${chatId}] Could not restore workflow state:`, error.message);
  }
  const runGeneration = state.runGeneration;
  state.jobRunnerActive = true;
  console.log(`[User ${chatId}] Job loop started.`);

  let consecutiveEmptyPolls = 0;

  while (state.jobRunnerActive && state.runGeneration === runGeneration) {
    if (state.nextScanAt > Date.now()) {
      await waitUntil(state.nextScanAt);
      continue;
    }

    if (state.sessionDeadline && Date.now() >= state.sessionDeadline) {
      if (!state.completionNotified && state.lastDecision !== 'expired') {
        state.completionNotified = true;
        await sendMessage(chatId, 'The 9-hour job application window has ended.');
      }
      state.lastDecision = 'expired';
      await persistWorkflowState(chatId, state, {
        last_decision: 'expired',
        last_decision_at: new Date().toISOString(),
      });
      state.jobRunnerActive = false;
      break;
    }

    if (state.currentPromptToken && state.currentPromptExpiresAt <= Date.now()) {
      const missedUrl = state.currentPromptUrl;
      const missedAt = state.currentPromptExpiresAt;
      await workflowStateStore.recordDecision(chatId, state.currentPromptToken, 'missed', missedAt).catch(() => { });
      state.currentPromptToken = null;
      state.currentPromptUrl = null;
      state.currentPromptSentAt = null;
      state.currentPromptExpiresAt = null;
      state.nextScanAt = Math.min(state.sessionDeadline, missedAt + randomMinutes(30, 40));
      await persistWorkflowState(chatId, state, {
        last_decision: 'missed',
        last_decision_at: new Date(missedAt).toISOString(),
      });
      await saveAppliedJob(chatId, missedUrl, 'Job missed', 'missed', 'timeout');
      await sendMessage(chatId, 'Job missed');
      continue;
    }

    const clientId = await getClientIdForChat(chatId);
    const applyProfile = clientId ? await loadApplyProfile(azure, clientId) : {};

    const scrapedAfter = (state.newdayRequestedAt || Date.now()) - NEWDAY_LOOKBACK_MS;
    const jobs = await readJobUrls(clientId, applyProfile.applywizz_id, scrapedAfter);
    const urls = jobs.map((job) => job.url);
    const hasNewUrl = urls.some((url) => !state.knownJobUrls.has(url));
    state.knownJobUrls = new Set(urls);

    if (state.completionNotified && !hasNewUrl) {
      consecutiveEmptyPolls++;
      const delayMs = Math.min(10000 * Math.pow(2, Math.max(0, consecutiveEmptyPolls - 1)), 300000);
      await new Promise((r) => setTimeout(r, delayMs));
      continue;
    }

    if (hasNewUrl) {
      consecutiveEmptyPolls = 0;
      state.completionNotified = false;
      console.log(`[User ${chatId}] New job URL detected; resuming scanner.`);
    }

    let offeredAny = false;
    let unhandledUrlFound = false;

    if (jobs.length > 0 || consecutiveEmptyPolls === 0) {
      console.log(`[User ${chatId}] Processing ${jobs.length} unhandled jobs. Profile AWL ID: '${applyProfile.applywizz_id}'`);
    }
    for (const job of jobs) {
      const { url } = job;
      if (!state.jobRunnerActive || state.runGeneration !== runGeneration) {
        console.log(`[User ${chatId}] Job runner stopped.`);
        break;
      }

      if (await hasHandledJob(chatId, url)) {
        console.log(`[User ${chatId}] Skipping ${url}: Already handled (in applications or queue).`);
        continue;
      }

      if (state.workflowActive) {
        console.log(`[User ${chatId}] Workflow active, waiting 5s...`);
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }

      if (!clientId) {
        await sendMessage(chatId, 'Cannot queue apply: Telegram is not linked to a client.');
        continue;
      }

      const linkCutoff = state.sessionStartedAt && state.sessionStartedAt + LINK_CUTOFF_MS;
      const promptStillOpen = state.currentPromptToken && state.currentPromptExpiresAt > Date.now();
      if (linkCutoff && Date.now() >= linkCutoff && !promptStillOpen) {
        if (!state.completionNotified && state.lastDecision !== 'expired') {
          state.completionNotified = true;
          await sendMessage(chatId, 'The 9-hour job application window has ended.');
        }
        state.lastDecision = 'expired';
        await persistWorkflowState(chatId, state, { last_decision: 'expired', last_decision_at: new Date().toISOString() });
        state.jobRunnerActive = false;
        break;
      }

      if (String(job.applywizzId || '') !== String(applyProfile.applywizz_id || '')) {
        console.log(`[User ${chatId}] Skipping ${url}: applywizz_id mismatch. Job: '${job.applywizzId}', Profile: '${applyProfile.applywizz_id}'`);
        continue;
      }

      const isResumingPrompt = state.currentPromptToken && state.currentPromptUrl === url;

      // Pre-flight check: Verify Apply button & internal Dice application before sending prompt
      if (!isResumingPrompt) {
        console.log(`[User ${chatId}] Running pre-flight check on ${url}...`);
        const precheck = await prevalidateJob(chatId, job);
        if (!precheck.ok) {
          console.log(`[User ${chatId}] Pre-flight check failed for ${url}: ${precheck.reason}. Skipping silently.`);
          await saveAppliedJob(chatId, url, precheck.jobName || job.title || 'Unknown Job', 'failed', precheck.reason);
          continue;
        }
      }

      if (!state.sessionStartedAt) {
        state.sessionStartedAt = Date.now();
        state.sessionDeadline = state.sessionStartedAt + SESSION_MS;
        state.consecutiveNoCount = 0;
        await persistWorkflowState(chatId, state);
        await audit(chatId, 'session_started', {
          startedAt: new Date(state.sessionStartedAt).toISOString(),
          deadlineAt: new Date(state.sessionDeadline).toISOString(),
          linkCutoffAt: new Date(state.sessionStartedAt + LINK_CUTOFF_MS).toISOString(),
        });
      }

      unhandledUrlFound = true;

      console.log(`[User ${chatId}] ${isResumingPrompt ? 'Resuming' : 'Prompting for'} job: ${url}`);
      offeredAny = true;
      const promptToken = isResumingPrompt ? state.currentPromptToken : crypto.randomUUID();
      state.pendingJobUrl[promptToken] = url;
      const promptSentAt = isResumingPrompt ? state.currentPromptSentAt : Date.now();
      const promptExpiresAt = isResumingPrompt
        ? state.currentPromptExpiresAt
        : Math.min(state.sessionDeadline, promptSentAt + DECISION_TIMEOUT_MS);
      if (!isResumingPrompt) {
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
      }

      let promptText = 'New Job Found:\n';
      if (job.title) promptText += `Title: ${job.title}\n`;
      if (job.company) promptText += `Company: ${job.company}\n`;
      promptText += `Link: ${url}\n\nDo you want to apply?`;

      await sendMessageWithButtons(chatId, promptText, [
        [{ text: '✅ Yes', callback_data: `job_yes_${promptToken}` }],
        [{ text: '❌ No', callback_data: `job_no_${promptToken}` }],
      ]);

      const decisionWaitMs = Math.min(
        DECISION_TIMEOUT_MS,
        Math.max(0, state.sessionDeadline - promptSentAt)
      );
      const response = await waitForDecision(chatId, decisionWaitMs);
      if (state.runGeneration !== runGeneration) break;
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
        await sendMessage(chatId, 'Job missed');
        state.nextScanAt = Math.min(state.sessionDeadline, promptSentAt + DECISION_TIMEOUT_MS + NEXT_LINK_DELAY_MS);
        await persistWorkflowState(chatId, state);
        await audit(chatId, 'next_link_scheduled', {
          reason: 'job_missed',
          scheduledAt: new Date(state.nextScanAt).toISOString(),
          delayMs: state.nextScanAt - Date.now(),
        });
        break;
      }

      if (!response.decision) {
        await saveAppliedJob(chatId, url, 'Skipped by user', 'rejected', 'user_clicked_no');
        await sendMessage(chatId, 'response noted-no');
        state.consecutiveNoCount += 1;
        if (state.consecutiveNoCount >= 3) {
          state.consecutiveNoCount = 0;
          state.nextScanAt = Math.min(state.sessionDeadline, clickAt + NEXT_LINK_DELAY_MS);
        } else {
          state.nextScanAt = clickAt;
        }
        await persistWorkflowState(chatId, state);
        await audit(chatId, 'next_link_scheduled', {
          reason: state.consecutiveNoCount === 0 ? 'third_no' : 'no_response',
          scheduledAt: new Date(state.nextScanAt).toISOString(),
          delayMs: Math.max(0, state.nextScanAt - Date.now()),
        });
        break;
      }

      state.consecutiveNoCount = 0;
      await sendMessage(chatId, 'response noted-yes');

      const availableAt = Date.now() + randomMinutes(15, 20);
      console.log(`[User ${chatId}] Yes accepted; automation available at ${new Date(availableAt).toISOString()}`);
      await audit(chatId, 'automation_delay_started', {
        url,
        startedAt: new Date().toISOString(),
        availableAt: new Date(availableAt).toISOString(),
        delayMs: availableAt - Date.now(),
      });

      const { data: jobRow } = await azure.from('dice_scraped_jobs').select('id').eq('url', url).maybeSingle();

      try {
        const { row, created, alreadyDone, activeClientJob } = await applyQueue.enqueueApplyJob({
          clientId,
          telegramChatId: chatId,
          url,
          jobId: jobRow?.id || null,
          availableAt: new Date(availableAt).toISOString(),
        });
        await audit(chatId, 'job_queued', { url, queueId: row?.id || null, availableAt });

        if (activeClientJob) {
          await sendMessage(chatId, 'An application for this client is already running. I’ll offer the next job once it finishes.');
          state.nextScanAt = Math.min(state.sessionDeadline, clickAt + NEXT_LINK_DELAY_MS);
          await persistWorkflowState(chatId, state);
          await audit(chatId, 'next_link_scheduled', {
            reason: 'yes',
            scheduledAt: new Date(state.nextScanAt).toISOString(),
            delayMs: Math.max(0, state.nextScanAt - Date.now()),
          });
          break;
        }

        if (alreadyDone) {
          await sendMessage(chatId, 'This job was already completed earlier. Skipping.');
          state.nextScanAt = Math.min(state.sessionDeadline, clickAt + NEXT_LINK_DELAY_MS);
          await persistWorkflowState(chatId, state);
          await audit(chatId, 'next_link_scheduled', {
            reason: 'yes',
            scheduledAt: new Date(state.nextScanAt).toISOString(),
            delayMs: Math.max(0, state.nextScanAt - Date.now()),
          });
          break;
        }

        state.nextScanAt = Math.min(state.sessionDeadline, clickAt + NEXT_LINK_DELAY_MS);
        await audit(chatId, 'next_link_scheduled', {
          reason: created ? 'yes' : 'yes_existing_queue',
          scheduledAt: new Date(state.nextScanAt).toISOString(),
          delayMs: Math.max(0, state.nextScanAt - Date.now()),
        });
        break;
      } catch (error) {
        console.error(`[User ${chatId}] Enqueue failed:`, error.message);
        await sendMessage(chatId, `Could not queue apply: ${error.message}`);
      }
    }

    const activeClientJob = clientId
      ? await applyQueue.hasActiveClientJob(clientId)
      : false;
    const allRecentJobsHandled = urls.length === 0 || (!unhandledUrlFound && !activeClientJob);
    if (
      allRecentJobsHandled &&
      !state.completionNotified &&
      state.jobRunnerActive &&
      state.runGeneration === runGeneration
    ) {
      const details = {
        jobCount: urls.length,
        checkedAt: new Date().toISOString(),
      };
      await audit(chatId, 'all_jobs_completed', details);
      const messageText = urls.length === 0
        ? 'Scanning Dice for new jobs. I will notify you when matching jobs appear.'
        : 'All jobs from the CSV have been completed. I will wait for new job links.';
      const sent = await sendMessage(chatId, messageText);
      if (sent) state.completionNotified = true;
    }

    if (!offeredAny && state.jobRunnerActive) {
      if (!state.completionNotified || hasNewUrl) {
        consecutiveEmptyPolls++;
      }
      const delayMs = Math.min(10000 * Math.pow(2, Math.max(0, consecutiveEmptyPolls - 1)), 300000);
      await new Promise((r) => setTimeout(r, delayMs));
    } else if (offeredAny) {
      consecutiveEmptyPolls = 0;
    }
  }

  console.log(`[User ${chatId}] Job runner stopped.`);
}
