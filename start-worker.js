require('dotenv').config();

const crypto = require('crypto');
const { createPool, createServiceClient } = require('./lib/azure');
const { openBrowser, closeBrowser, closeSharedBrowser, useBrowserbase, maxConcurrent } = require('./lib/browser');
const { createApplyQueue } = require('./lib/apply-queue');
const { startApplyWorkers } = require('./lib/apply-worker');
const { createWorkflowStateStore } = require('./lib/workflow-state');
const { fillCurrentStep, isVisibleEnabled, loadApplyProfile } = require('./lib/dice-apply-questions');
const { sendMessage } = require('./lib/telegram-notify');
const {
  savePendingQuestion,
  getAnswerForQuestion,
  clearExpiredPendingQuestions,
} = require('./lib/pending-answers');
const {
  storageStateIsValid,
  getSessionRow,
  readActiveSession,
  saveSession,
  getClientIdForChat,
  getSessionsPendingLogin,
} = require('./lib/dice-session');
const { saveAppliedJob } = require('./lib/job-application-db');
const {
  getJobsPendingPreflight,
  updateJobPreflightStatus,
} = require('./lib/job-scanner');

const dicePassword = process.env.DICE_PASSWORD;
if (!dicePassword) {
  throw new Error('DICE_PASSWORD must be set in the environment.');
}

const azure = createServiceClient();
const pool = createPool();
const applyQueue = createApplyQueue(azure);
const workflowStateStore = createWorkflowStateStore(azure);

const loginUrl = 'https://www.dice.com/dashboard/login';
const APPLY_TIMEOUT_MINUTES = Number(process.env.APPLY_TIMEOUT_MINUTES || 5);
const APPLY_TIMEOUT_MS = (Number.isFinite(APPLY_TIMEOUT_MINUTES) && APPLY_TIMEOUT_MINUTES > 0 ? APPLY_TIMEOUT_MINUTES : 5) * 60 * 1000;

let applyWorkerController = null;
let preflightStopping = false;

function audit(chatId, event, details = {}) {
  return workflowStateStore.log(chatId, event, details);
}

// === AUTOMATION HELPERS ===
function randomDelay(minSeconds, maxSeconds) {
  const minMs = minSeconds * 1000;
  const maxMs = maxSeconds * 1000;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

async function waitRandom(minSeconds, maxSeconds, label = null) {
  const ms = randomDelay(minSeconds, maxSeconds);
  if (label) console.log(`${label}: waiting ${ms / 1000} seconds...`);
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeWithHumanDelay(page, selector, value) {
  const field = page.locator(selector);
  await field.fill('');
  await field.pressSequentially(value, { delay: 90 + Math.random() * 140 });
}

function sessionExpiredError() {
  const error = new Error('Dice session expired.');
  error.code = 'SESSION_EXPIRED';
  return error;
}

async function getJobName(page) {
  const jobTitle = (await page.locator('h1').first().textContent() || '').trim();
  const company = (await page.locator('[data-wa-click="djv-job-company-profile-click"]').first().textContent() || '').trim();
  return company ? `${jobTitle} (${company})` : jobTitle;
}

// === LOGIN & SESSION REFRESH ===
async function runLogin(chatId, credentials, isBackgroundRefresh = true) {
  const handle = await openBrowser({ headless: isBackgroundRefresh || useBrowserbase });
  const { context, page, sessionId } = handle;

  try {
    await audit(chatId, 'dice_login_started', { background: isBackgroundRefresh });
    if (sessionId) {
      console.log(`[User ${chatId}] Login browser session: ${sessionId}`);
    }

    await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });
    await typeWithHumanDelay(page, 'input[type="email"]', credentials.email);
    await waitRandom(2, 5);
    await page.click('[data-testid="sign-in-button"]');

    await page.waitForSelector('input[type="password"]', { timeout: 30000 });
    await typeWithHumanDelay(page, 'input[type="password"]', dicePassword);
    await waitRandom(2, 6);
    await page.click('[data-testid="submit-password"]');
    await waitRandom(5, 15);
    await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => { });
    await page.waitForTimeout(3000);

    if (page.url().includes('/login')) {
      throw new Error(`Login did not complete. Current URL: ${page.url()}`);
    }

    const savedSession = await saveSession(
      context,
      chatId,
      credentials.email,
      credentials.applywizz_id,
      credentials.clientId
    );
    console.log(`[User ${chatId}] Login completed successfully.`);
    await audit(chatId, 'dice_login_completed');
    return savedSession;
  } finally {
    await closeBrowser(handle);
  }
}

async function refreshLogin(chatId) {
  console.log(`[User ${chatId}] Dice session is missing or expired. Running background auto-login...`);
  const sessionRow = await getSessionRow(chatId);
  if (!sessionRow || !sessionRow.email) {
    throw new Error(`No session record found for user ${chatId} to refresh.`);
  }

  await runLogin(chatId, {
    email: sessionRow.email,
    applywizz_id: sessionRow.applywizz_id,
    clientId: sessionRow.client_id,
  }, true);

  const refreshedSession = await readActiveSession(chatId);
  if (!refreshedSession) throw new Error('Background login completed without creating an active session.');

  return refreshedSession;
}

// === PRE-FLIGHT VALIDATION WORKER ===
const PREFLIGHT_CONCURRENCY = Math.max(1, Number(process.env.PREFLIGHT_MAX_CONCURRENT || 2));
let activePreflights = 0;
const preflightQueue = [];

function acquirePreflight() {
  if (activePreflights < PREFLIGHT_CONCURRENCY) {
    activePreflights += 1;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    preflightQueue.push(resolve);
  });
}

function releasePreflight() {
  activePreflights = Math.max(0, activePreflights - 1);
  const next = preflightQueue.shift();
  if (next) {
    activePreflights += 1;
    next();
  }
}

async function getAnyValidStorageState(preferredApplywizzId = null) {
  // 1. Try session with matching applywizz_id
  if (preferredApplywizzId) {
    const { data } = await azure
      .from('dice_sessions')
      .select('telegram_chat_id, storage_state')
      .eq('applywizz_id', preferredApplywizzId)
      .maybeSingle();

    if (data && storageStateIsValid(data.storage_state)) {
      return { chatId: Number(data.telegram_chat_id), storageState: data.storage_state };
    }
  }

  // 2. Fall back to any active session
  const { data: anySession } = await azure
    .from('dice_sessions')
    .select('telegram_chat_id, storage_state')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (anySession && storageStateIsValid(anySession.storage_state)) {
    return { chatId: Number(anySession.telegram_chat_id), storageState: anySession.storage_state };
  }

  return null;
}

async function prevalidateJob(chatId, job, storageState = null) {
  await acquirePreflight();
  try {
    let activeState = storageState;
    if (!activeState && chatId) {
      const activeSession = await readActiveSession(chatId);
      activeState = activeSession?.storageState || null;
    }

    if (!activeState) {
      console.warn(`[pre-flight] No Dice storageState available for ${job.url}. Skipping check.`);
      return { ok: true, jobName: job.title || 'Unknown Job' };
    }

    let handle = null;
    try {
      handle = await openBrowser({ storageState: activeState });
      const { page } = handle;
      await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForLoadState('networkidle').catch(() => {});

      const jobName = await getJobName(page).catch(() => job.title || 'Unknown Job');

      if (page.url().includes('/login')) {
        console.warn(`[pre-flight] Session expired during pre-flight check for ${job.url}`);
        return { ok: false, reason: 'session_expired', jobName };
      }

      const applyButton = page.getByTestId('apply-button');
      const applyCount = await applyButton.count().catch(() => 0);
      if (applyCount === 0) {
        return { ok: false, reason: 'no_apply_button', jobName };
      }

      const isVisible = await applyButton.first().isVisible().catch(() => false);
      if (!isVisible) {
        return { ok: false, reason: 'no_apply_button', jobName };
      }

      const popupPromise = page.context()
        .waitForEvent('page', { timeout: 4000 })
        .catch(() => null);

      await applyButton.first().click().catch(() => {});

      const applicationPage = await Promise.race([
        popupPromise,
        new Promise((resolve) => setTimeout(() => resolve(null), 4000)),
      ]) || page;

      await applicationPage.waitForLoadState('domcontentloaded').catch(() => {});

      if (!applicationPage.url().includes('dice.com')) {
        return { ok: false, reason: 'external', jobName };
      }

      return { ok: true, jobName };
    } catch (error) {
      console.warn(`[pre-flight] Validation error for ${job.url}:`, error.message);
      return { ok: true, jobName: job.title || 'Unknown Job' };
    } finally {
      if (handle) {
        await closeBrowser(handle).catch(() => {});
      }
    }
  } finally {
    releasePreflight();
  }
}

async function runPreflightLoop() {
  console.log('[dice_apply_worker] Pre-flight scanner loop started.');
  while (!preflightStopping) {
    try {
      const pendingJobs = await getJobsPendingPreflight(5);
      if (pendingJobs.length === 0) {
        await new Promise((r) => setTimeout(r, 8000));
        continue;
      }

      for (const job of pendingJobs) {
        if (preflightStopping) break;

        const sessionInfo = await getAnyValidStorageState(job.applywizz_id);
        const chatId = sessionInfo?.chatId || null;
        const storageState = sessionInfo?.storageState || null;

        console.log(`[pre-flight] Validating job ${job.id}: ${job.url}...`);
        const precheck = await prevalidateJob(chatId, job, storageState);

        if (precheck.ok) {
          console.log(`[pre-flight] Job ${job.id} PASSED pre-flight.`);
          await updateJobPreflightStatus(job.id, 'passed');
        } else {
          console.log(`[pre-flight] Job ${job.id} FAILED pre-flight: ${precheck.reason}`);
          await updateJobPreflightStatus(job.id, 'preflight_failed');
          if (chatId) {
            await saveAppliedJob(chatId, job.url, precheck.jobName || job.title || 'Unknown Job', 'preflight_failed', precheck.reason);
          }
        }
      }
    } catch (err) {
      console.error('[pre-flight] Error in pre-flight loop:', err.message);
      await new Promise((r) => setTimeout(r, 10000));
    }
  }
  console.log('[dice_apply_worker] Pre-flight scanner loop stopped.');
}

// === BACKGROUND LOGIN CHECKER ===
// Automatically runs runLogin for any newly linked accounts where storage_state is null
async function runPendingLoginsLoop() {
  while (!preflightStopping) {
    try {
      const pending = await getSessionsPendingLogin();
      for (const session of pending) {
        const chatId = Number(session.telegram_chat_id);
        console.log(`[dice_apply_worker] Running initial background login for chat ${chatId} (${session.email})...`);
        try {
          await runLogin(chatId, {
            email: session.email,
            applywizz_id: session.applywizz_id,
            clientId: session.client_id,
          }, true);
          await sendMessage(chatId, 'Dice login successful.');
        } catch (loginErr) {
          console.error(`[dice_apply_worker] Initial login failed for user ${chatId}:`, loginErr.message);
          await sendMessage(chatId, `Dice login failed: ${loginErr.message}`);
        }
      }
    } catch (err) {
      console.error('[dice_apply_worker] Error checking pending logins:', err.message);
    }
    await new Promise((r) => setTimeout(r, 10000));
  }
}

// === JOB APPLICATION FLOW ===
function createTelegramQuestionPrompt(targetChatId, currentJobName) {
  return async function onPromptFallback({ question, options = [], type = 'text' }) {
    const questionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await savePendingQuestion({
      telegramChatId: targetChatId,
      questionToken,
      questionText: question,
      options: options && options.length ? options : null,
      expiresAt,
    });

    let msg = `❓ Application Question Needed\nJob: ${currentJobName}\n\nQuestion: ${question}`;
    if (options && options.length) {
      msg += '\n\nOptions:';
      options.forEach((opt, idx) => {
        msg += `\n${idx + 1}. ${opt}`;
      });
    }
    msg += `\n\n⏳ Please reply with your answer (or reply 'skip' to skip this job) within 15 minutes.`;

    await sendMessage(targetChatId, msg);

    // Poll dice_pending_answers until Bot records user's reply or timeout
    const deadline = Date.now() + 15 * 60 * 1000;
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 4000));
      const row = await getAnswerForQuestion(questionToken).catch(() => null);
      if (row && row.answer != null) {
        if (row.answer === 'SKIPPED_BY_USER') {
          throw new Error('SKIPPED_BY_USER');
        }
        return row.answer;
      }
    }

    await sendMessage(targetChatId, "you didn't give response, job missed.");
    throw new Error("You didn't give response, job missed.");
  };
}

async function applyToJobOnPage(page, jobName, url, chatId) {
  await waitRandom(5, 15, 'After opening URL');

  const applyButton = page.getByTestId('apply-button');
  const applyCount = await applyButton.count();
  if (applyCount === 0) {
    console.log(`Apply button not found; skipping URL: ${url}`);
    return false;
  }

  await applyButton.waitFor({ state: 'visible', timeout: 30000 });
  await applyButton.scrollIntoViewIfNeeded();

  const popupPromise = page.context()
    .waitForEvent('page', { timeout: 5000 })
    .catch(() => null);
  await applyButton.click();
  const applicationPage = await Promise.race([
    popupPromise,
    new Promise((resolve) => setTimeout(() => resolve(null), 5000)),
  ]) || page;

  await applicationPage.waitForLoadState('domcontentloaded').catch(() => { });
  await applicationPage.waitForLoadState('networkidle').catch(() => { });
  await waitRandom(5, 15, 'After Apply opens application page');
  if (applicationPage.url().includes('/login')) throw sessionExpiredError();

  if (!applicationPage.url().includes('dice.com')) {
    console.warn(`[User ${chatId}] Skipped ${jobName}: Redirected to external site.`);
    await saveAppliedJob(chatId, url, jobName, 'apply_failed', 'external_redirect');
    await sendMessage(chatId, 'application failed, reviewing.');
    return false;
  }

  const clientId = await getClientIdForChat(chatId);
  const applyProfile = await loadApplyProfile(azure, clientId);
  console.log('[apply-questions] loaded profile', {
    clientId: clientId || null,
    hasOffice: applyProfile.can_work_3_days_in_office ?? null,
  });

  while (true) {
    if (applicationPage.url().includes('/login')) throw sessionExpiredError();

    const nextButton = applicationPage.getByRole('button', { name: /^Next$/i });
    const submitButton = applicationPage.getByRole('button', { name: /^Submit$/i });

    try {
      await Promise.any([
        nextButton.waitFor({ state: 'visible', timeout: 10000 }),
        submitButton.waitFor({ state: 'visible', timeout: 10000 })
      ]);
    } catch (e) {
      console.warn(`[User ${chatId}] Skipped ${jobName}: Missing Next/Submit (likely an extra question we could not fill).`);
      await saveAppliedJob(chatId, url, jobName, 'apply_failed', 'missing_next_or_submit');
      await sendMessage(chatId, 'application failed, reviewing.');
      return false;
    }

    const nextVisible = await nextButton.count() > 0 && await nextButton.first().isVisible().catch(() => false);
    const submitVisible = await submitButton.count() > 0 && await submitButton.first().isVisible().catch(() => false);

    if (submitVisible && !nextVisible) {
      break;
    }

    if (nextVisible) {
      const onPromptFallback = createTelegramQuestionPrompt(chatId, jobName);
      const filled = await fillCurrentStep(applicationPage, applyProfile, {
        dbPool: pool,
        onPromptFallback,
      });
      if (!filled.ok) {
        if (filled.reason === 'SKIPPED_BY_USER' || filled.reason?.includes("didn't give response")) {
          console.log(`[User ${chatId}] Job skipped: ${filled.reason}`);
          await saveAppliedJob(chatId, url, jobName, 'skipped', filled.reason);
          return false;
        }
        console.warn(`[User ${chatId}] Skipped ${jobName}: ${filled.reason || 'Could not answer an application question.'}`);
        await saveAppliedJob(chatId, url, jobName, 'apply_failed', filled.reason || 'unanswered_question');
        await sendMessage(chatId, 'application failed, reviewing.');
        return false;
      }

      if (!await isVisibleEnabled(nextButton)) {
        console.warn(`[User ${chatId}] Skipped ${jobName}: Next stayed disabled after filling questions.`);
        await saveAppliedJob(chatId, url, jobName, 'apply_failed', 'next_button_disabled');
        await sendMessage(chatId, 'application failed, reviewing.');
        return false;
      }

      await nextButton.first().scrollIntoViewIfNeeded();
      await nextButton.first().click();
      await applicationPage.waitForLoadState('networkidle').catch(() => { });
      await waitRandom(10, 20, 'After Next opens new page');
      continue;
    }

    break;
  }

  if (applicationPage.url().includes('/login')) throw sessionExpiredError();

  const submitButton = applicationPage.getByRole('button', { name: /^Submit$/i });
  if (await isVisibleEnabled(submitButton)) {
    await submitButton.first().scrollIntoViewIfNeeded();
    await submitButton.first().click();
    await applicationPage.waitForLoadState('networkidle').catch(() => { });
    await waitRandom(1, 4, 'After Submit opens next page');

    await saveAppliedJob(chatId, url, jobName, 'completed');
    await sendMessage(chatId, `✅ Application submitted successfully for:\n${jobName}`);
    return true;
  }

  console.warn(`[User ${chatId}] Skipped ${jobName}: Could not complete application.`);
  await saveAppliedJob(chatId, url, jobName, 'apply_failed', 'submit_button_not_clickable');
  await sendMessage(chatId, 'application failed, reviewing.');
  return false;
}

// Runs one queued apply on Browserbase/local. Throws on hard failure.
async function executeQueuedApply(job, { signal } = {}) {
  const chatId = Number(job.telegram_chat_id);
  const url = job.url;

  if (signal?.aborted) {
    throw new Error('Apply aborted before start');
  }

  await sendMessage(chatId, 'applying to the job');

  let activeSession = await readActiveSession(chatId);
  if (!activeSession) {
    activeSession = await refreshLogin(chatId);
  }

  let handle = await openBrowser({
    storageState: activeSession.storageState,
    headless: useBrowserbase,
  });
  if (handle.sessionId) {
    console.log(`[User ${chatId}] Apply browser session: ${handle.sessionId}`);
  }

  const onAbort = () => {
    console.warn(`[User ${chatId}] Apply timeout reached: closing browser.`);
    closeBrowser(handle).catch(() => {});
  };

  if (signal) {
    signal.addEventListener('abort', onAbort, { once: true });
  }

  try {
    let retryAfterLogin = true;
    while (retryAfterLogin) {
      if (signal?.aborted) break;
      retryAfterLogin = false;
      const page = await handle.context.newPage();
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(3000);

        if (page.url().includes('/login')) {
          activeSession = await refreshLogin(chatId);
          await closeBrowser(handle);
          handle = await openBrowser({
            storageState: activeSession.storageState,
            headless: useBrowserbase,
          });
          retryAfterLogin = true;
          continue;
        }

        const jobName = await getJobName(page);
        await applyToJobOnPage(page, jobName, url, chatId);
      } catch (error) {
        if (signal?.aborted) {
          console.warn(`[User ${chatId}] Application to ${url} aborted due to timeout.`);
          await saveAppliedJob(chatId, url, 'Failed', 'apply_failed', 'application_timeout').catch(() => {});
          throw error;
        }
        if (error.code === 'SESSION_EXPIRED') {
          activeSession = await refreshLogin(chatId);
          await closeBrowser(handle);
          handle = await openBrowser({
            storageState: activeSession.storageState,
            headless: useBrowserbase,
          });
          retryAfterLogin = true;
        } else {
          console.error(`[User ${chatId}] Failed to apply to ${url}:`, error.message);
          await saveAppliedJob(chatId, url, 'Failed', 'apply_failed', error.message);
          await sendMessage(chatId, 'application failed, reviewing.');
          throw error;
        }
      } finally {
        if (page && !page.isClosed()) await page.close().catch(() => { });
      }
    }
  } finally {
    if (signal) {
      signal.removeEventListener('abort', onAbort);
    }
    await closeBrowser(handle);
  }
}

// === BOOTSTRAP ===
(async () => {
  console.log('[dice_apply_worker] Initializing apply queue workers...');
  console.log(`[dice_apply_worker] Browser provider: ${useBrowserbase ? `browserbase (max ${maxConcurrent} concurrent)` : 'local'}`);

  applyWorkerController = startApplyWorkers({
    queue: applyQueue,
    executeJob: executeQueuedApply,
    preflightJob: async (job) => {
      const chatId = Number(job.telegram_chat_id);
      const precheck = await prevalidateJob(chatId, { url: job.url, title: 'Job' });
      if (!precheck.ok) {
        await saveAppliedJob(chatId, job.url, precheck.jobName || 'Unknown Job', 'preflight_failed', precheck.reason);
        throw new Error(`preflight_failed: ${precheck.reason}`);
      }
    },
    audit,
    concurrency: maxConcurrent,
    pollMs: 2000,
    applyTimeoutMs: APPLY_TIMEOUT_MS,
    sendTimeoutMessage: (chatId, company) =>
      sendMessage(
        chatId,
        `❌ We were unable to complete your application to ${company} within the expected time. We'll look into it and get back to you.`
      ),
  });

  console.log(`[dice_apply_worker] ${maxConcurrent} apply queue worker(s) running.`);

  // Start background loops
  runPendingLoginsLoop().catch((err) => console.error('[dice_apply_worker] Pending logins loop error:', err.message));

  // Periodic cleanup of expired questions
  setInterval(() => {
    clearExpiredPendingQuestions().catch(() => {});
  }, 30 * 60 * 1000);
})().catch((error) => {
  console.error(`Could not start dice_apply_worker: ${error.message}`);
  process.exit(1);
});

async function shutdown() {
  console.log('[dice_apply_worker] Shutting down...');
  preflightStopping = true;
  if (applyWorkerController) applyWorkerController.stop();
  await closeSharedBrowser().catch(() => {});
  await pool.end().catch(() => {});
  process.exit(0);
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
