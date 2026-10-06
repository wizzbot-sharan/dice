require('dotenv').config();
const { getClientPrefix } = require('./lib/logger');


const crypto = require('crypto');
const { createPool, createServiceClient } = require('./lib/azure');
const { openBrowser, closeBrowser, closeSharedBrowser, maxConcurrent } = require('./lib/browser');
const { createApplyQueue } = require('./lib/apply-queue');
const { startApplyWorkers } = require('./lib/apply-worker');
const { createWorkflowStateStore } = require('./lib/workflow-state');
const { fillCurrentStep, isVisibleEnabled, loadApplyProfile, readTotalStepCount, extractPreflightQuestions } = require('./lib/dice-apply-questions');
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
const { saveAppliedJob, patchJobProof } = require('./lib/job-application-db');
const { hasAwsS3Config, uploadScreenshot } = require('./lib/s3-screenshot');
const { verifyJobApplicationEmail } = require('./lib/zoho-mail-reader');
const {
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
const APPLY_TIMEOUT_MINUTES = Number(process.env.APPLY_TIMEOUT_MINUTES || 20);
const APPLY_TIMEOUT_MS = (Number.isFinite(APPLY_TIMEOUT_MINUTES) && APPLY_TIMEOUT_MINUTES > 0 ? APPLY_TIMEOUT_MINUTES : 20) * 60 * 1000;

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
  const handle = await openBrowser({ headless: true });
  const { context, page, sessionId } = handle;

  try {
    await audit(chatId, 'dice_login_started', { background: isBackgroundRefresh });
    if (sessionId) {
      console.log(`${await getClientPrefix(chatId)} Login browser session: ${sessionId}`);
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
    console.log(`${await getClientPrefix(chatId)} Login completed successfully.`);
    await audit(chatId, 'dice_login_completed');
    return savedSession;
  } finally {
    await closeBrowser(handle);
  }
}

async function refreshLogin(chatId) {
  console.log(`${await getClientPrefix(chatId)} Dice session is missing or expired. Running background auto-login...`);
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
      await page.waitForLoadState('load', { timeout: 45000 }).catch(() => {});

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

      // --- Detect step count ---
      const stepCount = await readTotalStepCount(applicationPage).catch(() => null);
      console.log(`[pre-flight] Detected step count: ${stepCount} for ${jobName}`);

      if (stepCount !== 3) {
        // 2-step (or unknown): existing behaviour
        console.log(`[pre-flight] Job is a ${stepCount || 'unknown'}-step process. Skipping Step 2 extraction.`);
        return { ok: true, jobName, stepCount: stepCount || 2 };
      }

      // --- 3-step: navigate to Step 2 and extract unknown questions ---
      console.log(`[pre-flight] Job is a 3-step process. Navigating to Step 2 to search for unknown questions...`);
      const clientId = await getClientIdForChat(chatId).catch(() => null);
      const applyProfile = clientId
        ? await loadApplyProfile(azure, clientId).catch(() => ({}))
        : {};

      const nextButton = applicationPage.getByRole('button', { name: /^Next$/i });
      const nextVisible = await nextButton.count() > 0 &&
        await nextButton.first().isVisible().catch(() => false);

      if (!nextVisible) {
        console.log(`[pre-flight] Could not find the Next button to reach Step 2!`);
        return { ok: false, reason: 'preflight_extraction_failed: next_button_not_found', jobName };
      }

      await nextButton.first().click();
      await applicationPage.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});

      console.log(`[pre-flight] Reached Step 2. Extracting questions using Hugging Face...`);
      const extraction = await extractPreflightQuestions(applicationPage, applyProfile, { dbPool: pool });

      if (!extraction.ok) {
        console.log(`[pre-flight] Extraction failed: ${extraction.reason}`);
        return { ok: false, reason: extraction.reason, jobName };
      }

      console.log(`[pre-flight] Extraction successful! Found ${extraction.unknownQuestions?.length || 0} unknown questions.`);
      return { ok: true, jobName, stepCount: 3, unknownQuestions: extraction.unknownQuestions };
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



const loginAttempts = new Map();

// === BACKGROUND LOGIN CHECKER ===
// Automatically runs runLogin for any newly linked accounts where storage_state is null
async function runPendingLoginsLoop() {
  while (!preflightStopping) {
    try {
      const pending = await getSessionsPendingLogin();
      for (const session of pending) {
        const chatId = Number(session.telegram_chat_id);
        const attempts = loginAttempts.get(chatId) || 0;
        
        if (attempts >= 3) {
          continue; // Skip trying if it has already failed 3 times
        }

        console.log(`[dice_apply_worker] Running initial background login for chat ${chatId} (${session.email}) - Attempt ${attempts + 1}/3...`);
        try {
          await runLogin(chatId, {
            email: session.email,
            applywizz_id: session.applywizz_id,
            clientId: session.client_id,
          }, true);
          loginAttempts.delete(chatId); // Reset on success
          await sendMessage(chatId, 'Dice login successful.');
        } catch (loginErr) {
          const newAttempts = attempts + 1;
          loginAttempts.set(chatId, newAttempts);
          
          console.error(`[dice_apply_worker] Initial login failed for user ${chatId}:`, loginErr.message);
          
          if (newAttempts >= 3) {
            await sendMessage(chatId, `Dice login failed 3 times and has been paused. Please check your credentials or login manually: ${loginErr.message}`);
          } else {
            await sendMessage(chatId, `Dice login failed (Attempt ${newAttempts}/3): ${loginErr.message}`);
          }
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
  await applicationPage.waitForLoadState('load', { timeout: 45000 }).catch(() => { });
  
  try {
    if (!applicationPage.url().includes('dice.com')) {
      await applicationPage.waitForURL('**/*dice.com*/**', { timeout: 15000 });
    }
  } catch (err) {}

  await waitRandom(5, 15, 'After Apply opens application page');
  if (applicationPage.url().includes('/login')) throw sessionExpiredError();

  if (!applicationPage.url().includes('dice.com')) {
    console.warn(`${await getClientPrefix(chatId)} Skipped ${jobName}: Redirected to external site. URL: ${applicationPage.url()}`);
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
      console.warn(`${await getClientPrefix(chatId)} Skipped ${jobName}: Missing Next/Submit (likely an extra question we could not fill). URL: ${applicationPage.url()}`);
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
          console.log(`${await getClientPrefix(chatId)} Job skipped: ${filled.reason}`);
          await saveAppliedJob(chatId, url, jobName, 'apply_failed', filled.reason);
          return false;
        }
        console.warn(`${await getClientPrefix(chatId)} Skipped ${jobName}: ${filled.reason || 'Could not answer an application question.'} URL: ${applicationPage.url()}`);
        await saveAppliedJob(chatId, url, jobName, 'apply_failed', filled.reason || 'unanswered_question');
        await sendMessage(chatId, 'application failed, reviewing.');
        return false;
      }

      if (!await isVisibleEnabled(nextButton)) {
        console.warn(`${await getClientPrefix(chatId)} Skipped ${jobName}: Next stayed disabled after filling questions. URL: ${applicationPage.url()}`);
        await saveAppliedJob(chatId, url, jobName, 'apply_failed', 'next_button_disabled');
        await sendMessage(chatId, 'application failed, reviewing.');
        return false;
      }

      await nextButton.first().scrollIntoViewIfNeeded();
      await nextButton.first().click();
      await applicationPage.waitForLoadState('load', { timeout: 45000 }).catch(() => { });
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
    
    // Application Proof System: 1. Screenshot
    console.log(`${await getClientPrefix(chatId)} Wait 3s before injecting banner...`);
    await applicationPage.waitForTimeout(3000);
    
    // Inject floating URL banner
    await applicationPage.evaluate(() => {
      const banner = document.createElement('div');
      banner.style.position = 'fixed';
      banner.style.top = '0';
      banner.style.left = '0';
      banner.style.width = '100%';
      banner.style.background = 'rgba(0, 0, 0, 0.8)';
      banner.style.color = 'white';
      banner.style.padding = '8px';
      banner.style.zIndex = '99999';
      banner.style.fontFamily = 'monospace';
      banner.style.fontSize = '14px';
      banner.innerText = 'Application URL: ' + window.location.href;
      document.body.appendChild(banner);
    });

    console.log(`${await getClientPrefix(chatId)} Wait 2s for banner to settle...`);
    await applicationPage.waitForTimeout(2000);

    const buffer = await applicationPage.screenshot({ type: 'png' });
    let screenshotUrl = null;

    if (hasAwsS3Config()) {
      const companyMatch = jobName.split(' - ');
      const company = companyMatch[0] || 'UnknownCompany';
      const title = companyMatch[1] || 'UnknownTitle';
      const applyProfileDetails = await pool.query('SELECT applywizz_id FROM clients_additional_info WHERE id = $1', [clientId]);
      const awlId = applyProfileDetails.rows[0]?.applywizz_id || 'UNKNOWN';

      screenshotUrl = await uploadScreenshot(buffer, awlId, company, title);
    } else {
      console.log(`${await getClientPrefix(chatId)} AWS S3 config missing. Skipping screenshot upload.`);
    }

    // Save as completed FIRST so we don't lose the successful submission status
    await saveAppliedJob(chatId, url, jobName, 'completed');
    await sendMessage(chatId, `✅ Application submitted successfully for:\n${jobName}`);

    // Application Proof System: 2. Zoho Mail Verification
    let emailJson = { status: "not connected" };
    
    // Check if user is connected
    const connectionRes = await pool.query('SELECT zoho_connection, company_email FROM clients_additional_info WHERE id = $1', [clientId]);
    const isConnected = connectionRes.rows[0]?.zoho_connection === true;
    const companyEmail = connectionRes.rows[0]?.company_email;

    if (isConnected && companyEmail) {
      if (!process.env.ZOHO_MAIL_READER_URL || !process.env.ZOHO_ADMIN_USERNAME) {
        emailJson = { status: "reader not configured" };
      } else {
        console.log(`${await getClientPrefix(chatId)} Starting Zoho Mail verification for ${companyEmail}...`);
        const companyMatch = jobName.split(' - ');
        const company = companyMatch[0] || '';
        const title = companyMatch[1] || jobName;

        // Note: verifyJobApplicationEmail handles its own abortSignal checks internally 
        // to not block if the worker timeout hits.
        const mailResult = await verifyJobApplicationEmail(companyEmail, company, title, null /* no strict signal yet */);
        emailJson = mailResult;
      }
    } else {
      console.log(`${await getClientPrefix(chatId)} Skipping Zoho verification (not connected).`);
    }

    // Patch the proof fields
    await patchJobProof(chatId, url, screenshotUrl, emailJson);

    return true;
  }

  console.warn(`${await getClientPrefix(chatId)} Skipped ${jobName}: Could not complete application (Submit button not clickable). URL: ${applicationPage.url()}`);
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
    headless: true });
  if (handle.sessionId) {
    console.log(`${await getClientPrefix(chatId)} Apply browser session: ${handle.sessionId}`);
  }

  const onAbort = async () => {
    console.warn(`${await getClientPrefix(chatId)} Apply timeout reached: closing browser.`);
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
        await page.waitForLoadState('load', { timeout: 45000 }).catch(() => {});
        await page.waitForTimeout(3000);

        if (page.url().includes('/login')) {
          activeSession = await refreshLogin(chatId);
          await closeBrowser(handle);
          handle = await openBrowser({
            storageState: activeSession.storageState,
            headless: true });
          retryAfterLogin = true;
          continue;
        }

        const jobName = await getJobName(page);
        await applyToJobOnPage(page, jobName, url, chatId);
      } catch (error) {
        if (signal?.aborted) {
          console.warn(`${await getClientPrefix(chatId)} Application to ${url} aborted due to timeout.`);
          await saveAppliedJob(chatId, url, 'Failed', 'apply_failed', 'application_timeout').catch(() => {});
          throw error;
        }
        if (error.code === 'SESSION_EXPIRED') {
          activeSession = await refreshLogin(chatId);
          await closeBrowser(handle);
          handle = await openBrowser({
            storageState: activeSession.storageState,
            headless: true });
          retryAfterLogin = true;
        } else {
          const currentUrl = page ? page.url() : url;
          console.error(`${await getClientPrefix(chatId)} Failed to apply to ${url}: ${error.message} | URL: ${currentUrl}`);
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
  console.log(`[dice_apply_worker] Browser provider: local (max ${maxConcurrent} concurrent)`);

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
      if (precheck.stepCount || precheck.unknownQuestions) {
        await applyQueue.setPreflightMetadata(job.id, {
          stepCount: precheck.stepCount || 2,
          unknownQuestions: precheck.unknownQuestions || [],
        });
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
