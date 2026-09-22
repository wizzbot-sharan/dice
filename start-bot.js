require('dotenv').config();

const crypto = require('crypto');
const { Bot } = require('node-telegram-bot-api');
const { createServiceClient } = require('./lib/azure');
const { createWorkflowStateStore } = require('./lib/workflow-state');
const { loadApplyProfile } = require('./lib/dice-apply-questions');
const { sendEmail } = require('./lib/mailer');
const { readJobUrls, NEWDAY_LOOKBACK_MS } = require('./lib/job-scanner');
const {
  getAllRegisteredUsers,
  getClientIdForChat,
  linkTelegramChat,
  readActiveSession,
  getSessionRow,
} = require('./lib/dice-session');
const { saveAppliedJob, hasHandledJob, applyQueue } = require('./lib/job-application-db');
const {
  findActivePendingQuestion,
  recordPendingAnswer,
} = require('./lib/pending-answers');

const botToken = process.env.BOT_TOKEN;
const allowedChatId = process.env.CHAT_ID ? Number(process.env.CHAT_ID) : null;

if (!botToken) {
  throw new Error('BOT_TOKEN must be set in the environment.');
}

const azure = createServiceClient();
const workflowStateStore = createWorkflowStateStore(azure);

const SESSION_MS = 9 * 60 * 60 * 1000;
const LINK_CUTOFF_MS = (8 * 60 + 32) * 60 * 1000;
const DECISION_TIMEOUT_MS = 15 * 60 * 1000;
const NEXT_LINK_DELAY_MS = 28 * 60 * 1000;

const bot = new Bot(botToken);
const userStates = new Map();

function stateFor(chatId) {
  if (!userStates.has(chatId)) {
    userStates.set(chatId, {
      conversation: null,
      workflowActive: false,
      jobRunnerActive: false,
      decisionResolver: null,
      pendingQuestion: null,
      pendingJobUrl: {},
      completionNotified: false,
      knownJobUrls: new Set(),
      sessionStartedAt: null,
      sessionDeadline: null,
      consecutiveNoCount: 0,
      nextScanAt: 0,
      decisionTimer: null,
      currentPromptToken: null,
      currentPromptUrl: null,
      currentPromptSentAt: null,
      currentPromptExpiresAt: null,
      newdayRequestedAt: null,
      runGeneration: 0,
      newdayInProgress: null,
    });
  }
  return userStates.get(chatId);
}

// === TELEGRAM HELPERS ===
async function sendMessage(chatId, text, options = {}) {
  try {
    await bot.api.sendMessage({ chat_id: chatId, text, ...options });
    return true;
  } catch (error) {
    console.error(`[User ${chatId}] Telegram message failed:`, error.message);
    return false;
  }
}

function sendMessageWithButtons(chatId, text, buttons) {
  return sendMessage(chatId, text, {
    reply_markup: {
      inline_keyboard: buttons,
    },
  });
}

function waitForConversationReply(chatId) {
  const state = stateFor(chatId);
  return new Promise((resolve, reject) => {
    state.conversation = { resolve, reject };
  });
}

function waitForDecision(chatId, timeoutMs = DECISION_TIMEOUT_MS) {
  const state = stateFor(chatId);
  return new Promise((resolve) => {
    const finish = (result) => {
      if (state.decisionTimer) clearTimeout(state.decisionTimer);
      state.decisionTimer = null;
      state.decisionResolver = null;
      state.currentPromptToken = null;
      resolve(result);
    };

    state.decisionResolver = (decision) => finish({
      decision,
      clickedAt: Date.now(),
    });
    state.decisionTimer = setTimeout(() => finish({
      decision: null,
      clickedAt: Date.now(),
    }), timeoutMs);
  });
}

function randomMinutes(min, max) {
  return (min + Math.random() * (max - min)) * 60 * 1000;
}

async function waitUntil(timestamp) {
  const remaining = timestamp - Date.now();
  if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
}

async function hydrateWorkflowState(chatId) {
  const state = stateFor(chatId);
  const row = await workflowStateStore.get(chatId);
  if (!row) return state;

  state.sessionStartedAt = row.session_started_at ? Date.parse(row.session_started_at) : null;
  state.sessionDeadline = row.session_deadline ? Date.parse(row.session_deadline) : null;
  state.consecutiveNoCount = row.consecutive_no_count || 0;
  state.nextScanAt = row.next_scan_at ? Date.parse(row.next_scan_at) : 0;
  state.currentPromptToken = row.current_prompt_token;
  state.currentPromptUrl = row.current_prompt_url;
  state.currentPromptSentAt = row.current_prompt_sent_at ? Date.parse(row.current_prompt_sent_at) : null;
  state.currentPromptExpiresAt = row.current_prompt_expires_at ? Date.parse(row.current_prompt_expires_at) : null;
  state.newdayRequestedAt = row.newday_requested_at ? Date.parse(row.newday_requested_at) : null;
  state.lastDecision = row.last_decision || null;

  if (row.last_decision === 'expired' || (state.sessionDeadline && Date.now() >= state.sessionDeadline)) {
    state.completionNotified = true;
  }

  return state;
}

async function persistWorkflowState(chatId, state, changes = {}) {
  await workflowStateStore.save(chatId, {
    session_started_at: state.sessionStartedAt ? new Date(state.sessionStartedAt).toISOString() : null,
    session_deadline: state.sessionDeadline ? new Date(state.sessionDeadline).toISOString() : null,
    consecutive_no_count: state.consecutiveNoCount,
    next_scan_at: state.nextScanAt ? new Date(state.nextScanAt).toISOString() : null,
    current_prompt_token: state.currentPromptToken,
    current_prompt_url: state.currentPromptUrl,
    current_prompt_sent_at: state.currentPromptSentAt ? new Date(state.currentPromptSentAt).toISOString() : null,
    current_prompt_expires_at: state.currentPromptExpiresAt ? new Date(state.currentPromptExpiresAt).toISOString() : null,
    newday_requested_at: state.newdayRequestedAt ? new Date(state.newdayRequestedAt).toISOString() : null,
    ...changes,
    updated_at: new Date().toISOString(),
  });
}

function audit(chatId, event, details = {}) {
  return workflowStateStore.log(chatId, event, details);
}

// === OTP HELPERS ===
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

function hashOtp(code) {
  return crypto.createHash('sha256').update(String(code).trim()).digest('hex');
}

async function saveOTP(chatId, email, otp) {
  const { error } = await azure.from('dice_telegram_otps').upsert(
    {
      telegram_chat_id: chatId,
      email,
      code_hash: hashOtp(otp),
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    },
    { onConflict: 'telegram_chat_id' }
  );
  if (error) throw new Error(`Could not save OTP: ${error.message}`);
}

async function verifyOTP(chatId, enteredCode) {
  const { data, error } = await azure
    .from('dice_telegram_otps')
    .select('code_hash, expires_at')
    .eq('telegram_chat_id', chatId)
    .maybeSingle();

  if (error) throw new Error(`Could not read OTP: ${error.message}`);
  if (!data) return { ok: false, reason: 'expired' };
  if (Date.parse(data.expires_at) <= Date.now()) {
    await deleteOTP(chatId);
    return { ok: false, reason: 'expired' };
  }
  if (data.code_hash !== hashOtp(enteredCode)) return { ok: false, reason: 'invalid' };
  return { ok: true };
}

async function deleteOTP(chatId) {
  const { error } = await azure.from('dice_telegram_otps').delete().eq('telegram_chat_id', chatId);
  if (error) console.error(`[User ${chatId}] Failed to delete OTP:`, error.message);
}

async function sendOTPEmail(email, otp, chatId = null) {
  try {
    const res = await sendEmail({
      to: email,
      subject: 'Your OTP Verification Code',
      text: `Your OTP code is: ${otp}\nThis code expires in 5 minutes.`,
      html: `<p>Your OTP code is: <strong>${otp}</strong></p><p>This code expires in 5 minutes.</p>`,
    });
    if (chatId && res.ok) await audit(chatId, 'otp_sent', { email }).catch(() => { });
    return res.ok;
  } catch (error) {
    console.error(`[OTP] Failed to send email to ${email}:`, error.message);
    return false;
  }
}

async function findUserByEmail(companyEmail) {
  const { data, error } = await azure
    .from('clients_additional_info')
    .select('id, applywizz_id, company_email, full_name')
    .eq('company_email', companyEmail.trim())
    .maybeSingle();

  if (error) {
    console.error('User lookup failed:', error.message);
    return null;
  }
  return data;
}

// === JOBS PROMPTING LOOP ===
// Background loop for an individual user: prompt Yes/No, enqueue on Yes.
// Pre-flight checks are handled upstream by the worker service (preflight_status = 'passed').
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

    if (!state.sessionDeadline || Date.now() >= state.sessionDeadline) {
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
      }
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

    let offeredAny = false;
    let unhandledUrlFound = false;
    let urls = [];
    let hasNewUrl = false;

    // Check if user currently has active items in the queue
    const activeQueueCount = clientId ? await applyQueue.countActiveQueueItems(clientId) : 0;

    // Scanner Phase: Only query and enqueue a new batch of up to 50 jobs if all previous jobs have finished
    if (activeQueueCount === 0 && clientId) {
      const scrapedAfter = (state.newdayRequestedAt || Date.now()) - NEWDAY_LOOKBACK_MS;
      const jobs = await readJobUrls(clientId, applyProfile.applywizz_id, scrapedAfter);
      urls = jobs.map((job) => job.url);
      hasNewUrl = urls.some((url) => !state.knownJobUrls.has(url));
      state.knownJobUrls = new Set(urls);

      if (hasNewUrl) {
        consecutiveEmptyPolls = 0;
        state.completionNotified = false;
        console.log(`[User ${chatId}] New job URLs detected; resuming scanner.`);
      }

      unhandledUrlFound = jobs.length > 0;
      if (jobs.length > 0) {
        console.log(`[User ${chatId}] Enqueueing batch of ${jobs.length} unhandled jobs for preflight. AWL ID: '${applyProfile.applywizz_id}'`);
        for (const job of jobs) {
          if (!state.jobRunnerActive || state.runGeneration !== runGeneration) break;
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
      }
    } else {
      unhandledUrlFound = activeQueueCount > 0;
    }

    // Prompter Phase: Check if we are ready to prompt the user
    if (!state.currentPromptToken && state.jobRunnerActive && state.runGeneration === runGeneration) {
      if (clientId) {
        const readyJobs = await applyQueue.getReadyPreflightPassedJobs(clientId);
        if (readyJobs.length > 0) {
          const job = readyJobs[0];
          const url = job.url;
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
      if (activeQueueCount > 0) {
        // Active jobs in queue being preflighted or queued - poll frequently for preflight_passed
        await new Promise((r) => setTimeout(r, 5000));
      } else {
        if (!state.completionNotified || hasNewUrl) {
          consecutiveEmptyPolls++;
        }
        const delayMs = Math.min(5000 * Math.pow(1.5, Math.min(6, consecutiveEmptyPolls)), 60000);
        await new Promise((r) => setTimeout(r, delayMs));
      }
    } else if (offeredAny) {
      consecutiveEmptyPolls = 0;
    }
  }

  console.log(`[User ${chatId}] Job runner stopped.`);
}

// === TELEGRAM WORKFLOW / COMMAND HANDLERS ===
async function runSignInWorkflow(chatId, { greet = false } = {}) {
  const state = stateFor(chatId);
  if (state.workflowActive) {
    await sendMessage(chatId, 'An operation is already running. Complete it or use /cancel first.');
    return;
  }

  state.workflowActive = true;
  try {
    if (greet) {
      await sendMessage(chatId, 'Welcome');
    }

    let email;
    while (true) {
      await sendMessage(chatId, 'Enter email id');
      email = await waitForConversationReply(chatId);
      if (email === '/cancel') throw new Error('Cancelled by user.');

      const otp = generateOTP();
      await saveOTP(chatId, email, otp);
      await sendOTPEmail(email, otp, chatId);
      await sendMessage(chatId, 'An OTP has been sent to your email. Please enter it below (expires in 5 minutes).');

      let otpVerified = false;
      while (true) {
        const enteredOTP = await waitForConversationReply(chatId);
        if (enteredOTP === '/cancel') throw new Error('Cancelled by user.');

        const otpResult = await verifyOTP(chatId, enteredOTP);
        if (otpResult.ok) {
          otpVerified = true;
          break;
        }

        if (otpResult.reason === 'expired') {
          await sendMessage(chatId, 'OTP expired. Please enter your email again.');
          break;
        }

        await sendMessage(chatId, 'Invalid OTP. Please enter the OTP again.');
      }

      if (otpVerified) break;
    }

    await deleteOTP(chatId);
    await sendMessage(chatId, 'Email verified!\nYour application process will start shortly.');

    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error('Email not found in our database. Please check and try again.');
    }

    await linkTelegramChat(chatId, user.id);

    // Save initial session record so worker can run/refresh login if needed
    const existingSession = await getSessionRow(chatId);
    if (!existingSession) {
      await azure.from('dice_sessions').upsert({
        telegram_chat_id: chatId,
        client_id: user.id,
        email,
        applywizz_id: user.applywizz_id || null,
        storage_state: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'telegram_chat_id' });
    }

    state.workflowActive = false;
    if (!state.jobRunnerActive) {
      state.jobRunnerActive = true;
      runJobsLoop(chatId).catch(console.error);
    }
  } catch (e) {
    await sendMessage(chatId, `Operation failed: ${e.message}`);
    state.workflowActive = false;
  }
}

async function startNewday(chatId) {
  const state = stateFor(chatId);
  if (state.newdayInProgress) return state.newdayInProgress;

  state.newdayInProgress = (async () => {
    await hydrateWorkflowState(chatId);
    if (Number.isFinite(state.sessionDeadline) && state.sessionDeadline > Date.now()) {
      await sendMessage(chatId, 'Your 9-hour job session is still active. Try /newday after it ends.');
      return;
    }

    const sessionRow = await getSessionRow(chatId);
    if (!sessionRow) {
      await sendMessage(chatId, 'Please sign in first with /start.');
      return;
    }

    state.jobRunnerActive = false;
    state.runGeneration += 1;
    if (state.decisionTimer) clearTimeout(state.decisionTimer);
    if (state.decisionResolver) state.decisionResolver(false);
    state.decisionTimer = null;
    state.decisionResolver = null;
    state.currentPromptToken = null;
    state.currentPromptUrl = null;
    state.currentPromptSentAt = null;
    state.currentPromptExpiresAt = null;
    state.sessionStartedAt = Date.now();
    state.sessionDeadline = state.sessionStartedAt + SESSION_MS;
    state.nextScanAt = 0;
    state.consecutiveNoCount = 0;
    state.completionNotified = false;
    state.knownJobUrls = new Set();
    state.pendingJobUrl = {};
    state.newdayRequestedAt = state.sessionStartedAt;

    await persistWorkflowState(chatId, state, {
      session_started_at: new Date(state.sessionStartedAt).toISOString(),
      session_deadline: new Date(state.sessionDeadline).toISOString(),
      next_scan_at: null,
      consecutive_no_count: 0,
      current_prompt_token: null,
      current_prompt_url: null,
      current_prompt_sent_at: null,
      current_prompt_expires_at: null,
      last_decision: null,
      last_decision_at: null,
    });
    await audit(chatId, 'newday_started', {
      requestedAt: new Date(state.newdayRequestedAt).toISOString(),
      jobsSince: new Date(state.newdayRequestedAt - NEWDAY_LOOKBACK_MS).toISOString(),
    });
    await audit(chatId, 'session_started', {
      startedAt: new Date(state.sessionStartedAt).toISOString(),
      deadlineAt: new Date(state.sessionDeadline).toISOString(),
    });

    state.jobRunnerActive = true;
    runJobsLoop(chatId).catch((error) => {
      console.error(`[User ${chatId}] New-day job loop failed:`, error.message);
    });
    await sendMessage(chatId, 'New day started. I will send the first eligible job scraped within the last 24 hours.');
  })().finally(() => {
    state.newdayInProgress = null;
  });

  return state.newdayInProgress;
}

async function handleCommand(chatId, text) {
  const state = stateFor(chatId);
  const normalized = text.toLowerCase().replace(/^[/#]+/, '').trim();

  if (['continue', 'yes', 'y'].includes(normalized) && state.decisionResolver) {
    const resolver = state.decisionResolver;
    resolver(true);
    return;
  }
  if (['stop', 'no', 'n'].includes(normalized) && state.decisionResolver) {
    const resolver = state.decisionResolver;
    resolver(false);
    return;
  }

  if (normalized === 'cancel') {
    if (state.conversation) {
      const conversation = state.conversation;
      state.conversation = null;
      conversation.resolve('/cancel');
      await sendMessage(chatId, 'Cancelled.');
    }
    return;
  }

  if (state.conversation) {
    const conversation = state.conversation;
    state.conversation = null;
    conversation.resolve(text.trim());
    return;
  }

  if (state.workflowActive) {
    await sendMessage(chatId, 'An operation is already running. Complete it or use /cancel first.');
    return;
  }

  if (normalized === 'newday') {
    await startNewday(chatId);
    return;
  }

  if (
    normalized === 'start' ||
    ['sign in', 'signin', 'login', 'log in'].includes(normalized)
  ) {
    await runSignInWorkflow(chatId, { greet: normalized === 'start' });
    return;
  }
}

bot.on('message', async (ctx) => {
  const chatId = ctx.message?.chat.id;
  if (!chatId || (allowedChatId && chatId !== allowedChatId) || typeof ctx.message.text !== 'string') return;

  const text = ctx.message.text.trim();
  const state = stateFor(chatId);

  // 1. Check if candidate is answering an unknown application question from Worker via DB
  try {
    const dbPendingQuestion = await findActivePendingQuestion(chatId);
    if (dbPendingQuestion) {
      if (/^(\/)?skip$/i.test(text)) {
        await recordPendingAnswer(dbPendingQuestion.question_token, 'SKIPPED_BY_USER');
        await sendMessage(chatId, 'Application skipped as requested.');
        return;
      }

      let selectedAnswer = text;
      let options = dbPendingQuestion.options;
      if (typeof options === 'string') {
        try { options = JSON.parse(options); } catch { options = null; }
      }
      if (Array.isArray(options) && options.length > 0) {
        const num = parseInt(text, 10);
        if (!Number.isNaN(num) && num >= 1 && num <= options.length) {
          selectedAnswer = options[num - 1];
        } else {
          const lowerText = text.toLowerCase();
          const matched = options.find((opt) => opt.toLowerCase() === lowerText)
            || options.find((opt) => opt.toLowerCase().includes(lowerText));
          if (matched) selectedAnswer = matched;
        }
      }

      await recordPendingAnswer(dbPendingQuestion.question_token, selectedAnswer);
      await sendMessage(chatId, 'response noted-question answered.');
      return;
    }
  } catch (err) {
    console.error(`[User ${chatId}] Error checking pending questions:`, err.message);
  }

  // 2. Local in-memory pendingQuestion check (fallback)
  if (state.pendingQuestion) {
    const pending = state.pendingQuestion;
    if (/^(\/)?skip$/i.test(text)) {
      clearTimeout(pending.timer);
      state.pendingQuestion = null;
      await sendMessage(chatId, 'Application skipped as requested.');
      pending.reject(new Error('SKIPPED_BY_USER'));
      return;
    }

    let selectedAnswer = text;
    if (pending.options && pending.options.length) {
      const num = parseInt(text, 10);
      if (!Number.isNaN(num) && num >= 1 && num <= pending.options.length) {
        selectedAnswer = pending.options[num - 1];
      } else {
        const lowerText = text.toLowerCase();
        const matched = pending.options.find((opt) => opt.toLowerCase() === lowerText)
          || pending.options.find((opt) => opt.toLowerCase().includes(lowerText));
        if (matched) selectedAnswer = matched;
      }
    }

    clearTimeout(pending.timer);
    state.pendingQuestion = null;
    await sendMessage(chatId, 'response noted-question answered.');
    pending.resolve(selectedAnswer);
    return;
  }

  handleCommand(chatId, ctx.message.text).catch(async (error) => {
    stateFor(chatId).conversation = null;
    console.error(`Command failed: ${error.message}`);
    await sendMessage(chatId, `Operation failed: ${error.message}`);
  });
});

bot.on('callback_query', async (ctx) => {
  const chatId = ctx.from?.id;
  const data = ctx.callbackQuery?.data;
  const message = ctx.callbackQuery?.message;

  if (!chatId || !data) {
    console.warn('Received callback_query without chatId or data:', { chatId, data, ctx });
    return;
  }

  try {
    await ctx.answerCallbackQuery().catch(() => { });
    if (message) {
      await bot.api.editMessageReplyMarkup({
        chat_id: message.chat?.id || chatId,
        message_id: message.message_id,
        reply_markup: { inline_keyboard: [] },
      }).catch(() => { });
    }
  } catch (error) {
    console.warn('[callback] failed to clear button markup:', error.message);
  }

  // Handle job yes/no buttons
  if (data.startsWith('job_yes_')) {
    const state = stateFor(chatId);
    const token = data.slice('job_yes_'.length);
    if (state.currentPromptToken !== token || Date.now() >= state.currentPromptExpiresAt) return;
    await workflowStateStore.recordDecision(chatId, token, 'yes', Date.now()).catch((error) => {
      console.error(`[User ${chatId}] Failed to record Yes decision:`, error.message);
    });
    const resolver = state.decisionResolver;
    if (resolver) {
      resolver(true);
    }
    return;
  }

  if (data.startsWith('job_no_')) {
    const state = stateFor(chatId);
    const token = data.slice('job_no_'.length);
    if (state.currentPromptToken !== token || Date.now() >= state.currentPromptExpiresAt) return;
    await workflowStateStore.recordDecision(chatId, token, 'no', Date.now()).catch((error) => {
      console.error(`[User ${chatId}] Failed to record No decision:`, error.message);
    });
    const resolver = state.decisionResolver;
    if (resolver) {
      resolver(false);
    }
    return;
  }
});

// === BOOTSTRAP ===
(async () => {
  console.log('[dice_telegram_bot] Testing bot token...');
  try {
    await bot.api.getMe();
    console.log('[dice_telegram_bot] Bot token verified.');
  } catch (e) {
    console.error('[dice_telegram_bot] Bot token test failed:', e.message);
    throw e;
  }

  console.log('[dice_telegram_bot] Starting Telegram polling...');
  bot.startPolling();
  console.log('[dice_telegram_bot] Telegram controller is running.');

  const users = await getAllRegisteredUsers();
  console.log(`[Startup] Found ${users.length} registered user(s).`);
  for (const chatId of users) {
    const sessionRow = await getSessionRow(chatId);
    if (sessionRow) {
      const workflowRow = await workflowStateStore.get(chatId).catch(() => null);
      const deadline = workflowRow?.session_deadline ? Date.parse(workflowRow.session_deadline) : null;
      
      if (!deadline) {
        console.log(`[Startup] User ${chatId} has no active session. Waiting for /newday.`);
        continue;
      }

      const isExpired = workflowRow?.last_decision === 'expired' || Date.now() >= deadline;

      if (isExpired) {
        console.log(`[Startup] User ${chatId} 9-hour session has already ended. Waiting for /newday.`);
        continue;
      }

      console.log(`[Startup] Auto-starting background job scanner for user ${chatId}`);
      const state = stateFor(chatId);
      state.jobRunnerActive = true;
      runJobsLoop(chatId).catch(console.error);
    }
  }
})().catch((error) => {
  console.error(`Could not start dice_telegram_bot: ${error.message}`);
  process.exit(1);
});

async function shutdown() {
  console.log('[dice_telegram_bot] Shutting down...');
  for (const state of userStates.values()) {
    if (state.pendingQuestion) {
      clearTimeout(state.pendingQuestion.timer);
      state.pendingQuestion.reject(new Error('Bot stopped.'));
      state.pendingQuestion = null;
    }
    if (state.conversation) state.conversation.reject(new Error('Bot stopped.'));
    if (state.decisionResolver) state.decisionResolver(false);
    state.jobRunnerActive = false;
  }
  if (bot.isRunning()) await bot.stopPolling().catch(() => { });
  process.exit(0);
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
