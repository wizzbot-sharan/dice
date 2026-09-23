const crypto = require('crypto');

const DECISION_TIMEOUT_MS = 15 * 60 * 1000;
const NEXT_LINK_DELAY_MS = 28 * 60 * 1000;

function randomMinutes(min, max) {
  return (min + Math.random() * (max - min)) * 60 * 1000;
}

/**
 * Apply Yes/No/missed outcome for a job prompt (DB-driven, webhook-safe).
 */
async function applyPromptDecision({
  chatId,
  decision,
  workflowRow,
  workflowStateStore,
  applyQueue,
  saveAppliedJob,
  audit,
  sendMessage,
  persistWorkflowPatch,
  getClientIdForChat,
}) {
  const url = workflowRow.current_prompt_url;
  const queueId = workflowRow.current_prompt_queue_id;
  const promptSentAt = workflowRow.current_prompt_sent_at
    ? Date.parse(workflowRow.current_prompt_sent_at)
    : Date.now();
  const sessionDeadline = workflowRow.session_deadline
    ? Date.parse(workflowRow.session_deadline)
    : null;
  const clickAt = Date.now();

  let consecutiveNoCount = workflowRow.consecutive_no_count || 0;

  await audit(chatId, decision === 'missed' ? 'job_missed' : decision === 'yes' ? 'job_yes' : 'job_no', {
    url,
    clickedAt: new Date(clickAt).toISOString(),
  });

  const clearPrompt = {
    current_prompt_token: null,
    current_prompt_url: null,
    current_prompt_sent_at: null,
    current_prompt_expires_at: null,
    current_prompt_queue_id: null,
    last_decision: decision,
    last_decision_at: new Date(clickAt).toISOString(),
  };

  if (decision === 'missed') {
    if (workflowRow.current_prompt_token) {
      await workflowStateStore.recordDecision(
        chatId,
        workflowRow.current_prompt_token,
        'missed',
        clickAt,
      ).catch(() => {});
    }
    await saveAppliedJob(chatId, url, 'Job missed', 'missed', 'timeout');
    if (queueId) {
      await applyQueue.updateJobStatus(queueId, 'failed', { last_error: 'timeout' });
    }
    await sendMessage(chatId, 'Job missed');
    const nextScanAt = sessionDeadline
      ? Math.min(sessionDeadline, promptSentAt + DECISION_TIMEOUT_MS + NEXT_LINK_DELAY_MS)
      : clickAt + NEXT_LINK_DELAY_MS;
    await persistWorkflowPatch(chatId, {
      ...clearPrompt,
      next_scan_at: new Date(nextScanAt).toISOString(),
    });
    await audit(chatId, 'next_link_scheduled', {
      reason: 'job_missed',
      scheduledAt: new Date(nextScanAt).toISOString(),
    });
    return;
  }

  if (decision === 'no') {
    await saveAppliedJob(chatId, url, 'Skipped by user', 'rejected', 'user_clicked_no');
    if (queueId) {
      await applyQueue.updateJobStatus(queueId, 'failed', { last_error: 'user_clicked_no' });
    }
    await sendMessage(chatId, 'response noted-no');
    consecutiveNoCount += 1;
    let nextScanAt = clickAt;
    if (consecutiveNoCount >= 3) {
      consecutiveNoCount = 0;
      nextScanAt = sessionDeadline
        ? Math.min(sessionDeadline, clickAt + NEXT_LINK_DELAY_MS)
        : clickAt + NEXT_LINK_DELAY_MS;
    }
    await persistWorkflowPatch(chatId, {
      ...clearPrompt,
      consecutive_no_count: consecutiveNoCount,
      next_scan_at: new Date(nextScanAt).toISOString(),
    });
    await audit(chatId, 'next_link_scheduled', {
      reason: consecutiveNoCount === 0 ? 'third_no' : 'no_response',
      scheduledAt: new Date(nextScanAt).toISOString(),
    });
    return;
  }

  if (decision === 'yes') {
    await sendMessage(chatId, 'response noted-yes');
    const availableAt = Date.now() + randomMinutes(15, 20);
    await audit(chatId, 'automation_delay_started', {
      url,
      startedAt: new Date().toISOString(),
      availableAt: new Date(availableAt).toISOString(),
    });
    if (queueId) {
      await applyQueue.updateJobStatus(queueId, 'queued', {
        available_at: new Date(availableAt).toISOString(),
      });
      await audit(chatId, 'job_queued', { url, queueId, availableAt });
    }
    const clientId = getClientIdForChat ? await getClientIdForChat(chatId) : null;
    if (clientId) {
      const activeClientJob = await applyQueue.hasActiveClientJob(clientId);
      if (activeClientJob) {
        await sendMessage(
          chatId,
          'An application for this client is already running. I’ll offer the next job once it finishes.',
        );
      }
    }
    const nextScanAt = sessionDeadline
      ? Math.min(sessionDeadline, clickAt + NEXT_LINK_DELAY_MS)
      : clickAt + NEXT_LINK_DELAY_MS;
    await persistWorkflowPatch(chatId, {
      ...clearPrompt,
      consecutive_no_count: 0,
      next_scan_at: new Date(nextScanAt).toISOString(),
    });
    await audit(chatId, 'next_link_scheduled', {
      reason: 'yes',
      scheduledAt: new Date(nextScanAt).toISOString(),
    });
  }
}

async function sendJobPrompt({
  chatId,
  job,
  sessionDeadlineMs,
  workflowStateStore,
  applyQueue,
  audit,
  sendMessageWithButtons,
  persistWorkflowPatch,
}) {
  const promptToken = crypto.randomUUID();
  const promptSentAt = Date.now();
  const promptExpiresAt = Math.min(sessionDeadlineMs, promptSentAt + DECISION_TIMEOUT_MS);
  const url = job.url;

  await workflowStateStore.recordPrompt(chatId, {
    token: promptToken,
    url,
    sentAt: promptSentAt,
    expiresAt: promptExpiresAt,
  });
  await persistWorkflowPatch(chatId, {
    current_prompt_token: promptToken,
    current_prompt_url: url,
    current_prompt_sent_at: new Date(promptSentAt).toISOString(),
    current_prompt_expires_at: new Date(promptExpiresAt).toISOString(),
    current_prompt_queue_id: job.id,
    completion_notified: false,
  });
  await audit(chatId, 'job_prompt_sent', { url, expiresAt: promptExpiresAt });
  await applyQueue.updateJobStatus(job.id, 'prompt_sent');

  const promptText = `New Job Passed Pre-Flight:\nLink: ${url}\n\nDo you want to apply?`;
  await sendMessageWithButtons(chatId, promptText, [
    [{ text: '✅ Yes', callback_data: `job_yes_${promptToken}` }],
    [{ text: '❌ No', callback_data: `job_no_${promptToken}` }],
  ]);
}

module.exports = {
  applyPromptDecision,
  sendJobPrompt,
  DECISION_TIMEOUT_MS,
  randomMinutes,
};
