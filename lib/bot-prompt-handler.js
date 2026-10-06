const crypto = require('crypto');
const { getClientPrefix, getJobDisplay } = require('./logger');
const { createPool } = require('./azure');

const DECISION_TIMEOUT_MS = 15 * 60 * 1000;
const NEXT_LINK_DELAY_MS = 28 * 60 * 1000;

function randomMinutes(min, max) {
  return (min + Math.random() * (max - min)) * 60 * 1000;
}

async function collectAndSavePreflightAnswer(chatId, question, jobUrl, {
  sendMessage, savePendingQuestion, getAnswerForQuestion, saveKnownAnswer, clientId,
}) {
  const questionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  await savePendingQuestion({
    telegramChatId: chatId,
    questionToken,
    questionText: question.text,
    options: question.options?.length ? question.options : null,
    expiresAt,
  });

  let msg = `❓ Question for your application:\n\n${question.text}`;
  
  if (question.type === 'radio' && question.options?.length) {
    msg += '\n\n(Format: Single Choice. Reply with the number or the exact text of your answer.)';
    msg += '\nOptions:';
    question.options.forEach((opt, i) => { msg += `\n${i + 1}. ${opt}`; });
  } else if (question.type === 'checkbox' && question.options?.length) {
    msg += '\n\n(Format: Checkboxes / Multiple Select. Reply with the exact text of your choice. If selecting multiple, separate them by commas.)';
    msg += '\nOptions:';
    question.options.forEach((opt, i) => { msg += `\n- ${opt}`; });
  } else {
    msg += '\n\n(Format: Free Text. Please type your answer.)';
  }
  
  await sendMessage(chatId, msg);

  const dbPool = createPool();

  // Poll for answer (15 min deadline)
  const deadline = Date.now() + 15 * 60 * 1000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 4000));
    const row = await getAnswerForQuestion(questionToken).catch(() => null);
    if (row?.answer != null) {
      if (row.answer === 'SKIPPED_BY_USER') {
        throw new Error(`Preflight question skipped by user: ${question.text}`);
      }
      // Save to dice_unknown_questions so apply step finds it automatically
      await saveKnownAnswer(dbPool, {
        clientId,
        questionText: question.text,
        questionType: question.type,
        options: question.options || [],
        answer: row.answer,
        source: 'preflight_user_input',
      }).catch(() => {});
      return;
    }
  }
  // Timeout: mark as SKIPPED so apply won't hang on this question
  throw new Error(`Preflight question timed out: ${question.text}`);
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
  savePendingQuestion,
  getAnswerForQuestion,
  saveKnownAnswer,
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
    const [clientPrefix, jobDisplay] = await Promise.all([
      getClientPrefix(chatId),
      getJobDisplay(url),
    ]);
    console.log(`${clientPrefix} Job prompt timed out (missed) for ${jobDisplay}`);
    if (workflowRow.current_prompt_token) {
      await workflowStateStore.recordDecision(
        chatId,
        workflowRow.current_prompt_token,
        'missed',
        clickAt,
      ).catch(() => {});
    }
    await saveAppliedJob(chatId, url, 'Job missed', 'apply_failed', 'timeout');
    if (queueId) {
      await applyQueue.updateJobStatus(queueId, 'apply_failed', { last_error: 'timeout' });
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
    const [clientPrefix, jobDisplay] = await Promise.all([
      getClientPrefix(chatId),
      getJobDisplay(url),
    ]);
    console.log(`${clientPrefix} User responded NO for ${jobDisplay}`);
    await saveAppliedJob(chatId, url, 'Skipped by user', 'apply_failed', 'user_clicked_no');
    if (queueId) {
      await applyQueue.updateJobStatus(queueId, 'apply_failed', { last_error: 'user_clicked_no' });
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
    const [clientPrefix, jobDisplay] = await Promise.all([
      getClientPrefix(chatId),
      getJobDisplay(url),
    ]);
    console.log(`${clientPrefix} User responded YES for ${jobDisplay}`);
    await sendMessage(chatId, 'response noted-yes');
    
    const clientId = getClientIdForChat ? await getClientIdForChat(chatId) : null;
    
    const preflightQuestions = workflowRow.pending_preflight_questions
      ? JSON.parse(workflowRow.pending_preflight_questions)
      : [];

    if (preflightQuestions.length > 0) {
      try {
        for (const q of preflightQuestions) {
          await collectAndSavePreflightAnswer(chatId, q, url, { sendMessage, savePendingQuestion, getAnswerForQuestion, saveKnownAnswer, clientId });
        }
      } catch (error) {
        console.warn(`${clientPrefix} Preflight question error: ${error.message}`);
        await saveAppliedJob(chatId, url, 'Apply Failed', 'apply_failed', 'preflight_question_error');
        if (queueId) {
          await applyQueue.updateJobStatus(queueId, 'apply_failed', { last_error: 'preflight_question_error' });
        }
        await sendMessage(chatId, 'Application failed during question collection, reviewing.');
        
        await persistWorkflowPatch(chatId, {
          ...clearPrompt,
          pending_preflight_questions: null,
          consecutive_no_count: 0,
          next_scan_at: new Date(Date.now() + NEXT_LINK_DELAY_MS).toISOString(),
        });
        return;
      }
      await persistWorkflowPatch(chatId, { pending_preflight_questions: null });
    }

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
  unknownQuestions = [],
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
    pending_preflight_questions: unknownQuestions.length
      ? JSON.stringify(unknownQuestions)
      : null,
    completion_notified: false,
  });
  await audit(chatId, 'job_prompt_sent', { url, expiresAt: promptExpiresAt });
  await applyQueue.updateJobStatus(job.id, 'prompt_sent');

  const [clientPrefix, jobDisplay] = await Promise.all([
    getClientPrefix(chatId),
    getJobDisplay(job),
  ]);
  console.log(`${clientPrefix} Sent job prompt for ${jobDisplay} (expires in ${Math.round(DECISION_TIMEOUT_MS / 60000)}m)`);

  let promptText = `New Job Passed Pre-Flight:\nLink: ${url}`;
  if (unknownQuestions.length > 0) {
    promptText += `\n\n⚠️ This job has ${unknownQuestions.length} question(s) that need your answers before we can apply.`;
    promptText += `\nAfter tapping Yes, I'll ask you each one.`;
  }
  promptText += `\n\nDo you want to apply?`;
  
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
