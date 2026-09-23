require('dotenv').config();

const crypto = require('crypto');
const http = require('http');
const { Bot } = require('node-telegram-bot-api');
const { createWebhookServer } = require('node-telegram-bot-api/node');
const { createServiceClient } = require('./lib/azure');
const { createWorkflowStateStore } = require('./lib/workflow-state');
const { loadApplyProfile } = require('./lib/dice-apply-questions');
const { sendEmail } = require('./lib/mailer');
const { NEWDAY_LOOKBACK_MS } = require('./lib/job-scanner');
const {
  getClientIdForChat,
  linkTelegramChat,
  getSessionRow,
} = require('./lib/dice-session');
const { saveAppliedJob, applyQueue } = require('./lib/job-application-db');
const {
  findActivePendingQuestion,
  recordPendingAnswer,
} = require('./lib/pending-answers');
const { createDueWorkTicker } = require('./lib/due-work-ticker');
const { applyPromptDecision } = require('./lib/bot-prompt-handler');

const botToken = process.env.BOT_TOKEN;
const allowedChatId = process.env.CHAT_ID ? Number(process.env.CHAT_ID) : null;
const telegramMode = (process.env.TELEGRAM_MODE || 'webhook').toLowerCase();
const webhookPath = process.env.TELEGRAM_WEBHOOK_PATH || '/telegram';
const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET || '';
const webhookUrl = process.env.WEBHOOK_URL || '';
const listenPort = Number(process.env.PORT || 8080);

if (!botToken) {
  throw new Error('BOT_TOKEN must be set in the environment.');
}

if (telegramMode === 'webhook' && !webhookUrl) {
  throw new Error('WEBHOOK_URL must be set when TELEGRAM_MODE=webhook.');
}

if (telegramMode === 'webhook' && !webhookSecret) {
  throw new Error('TELEGRAM_WEBHOOK_SECRET must be set when TELEGRAM_MODE=webhook.');
}

const azure = createServiceClient();
const workflowStateStore = createWorkflowStateStore(azure);

const SESSION_MS = 9 * 60 * 60 * 1000;

const bot = new Bot(botToken);
let httpServer = null;
let dueWorkTicker = null;

function audit(chatId, event, details = {}) {
  return workflowStateStore.log(chatId, event, details);
}

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
    { onConflict: 'telegram_chat_id' },
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
    if (chatId && res.ok) await audit(chatId, 'otp_sent', { email }).catch(() => {});
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

async function persistWorkflowPatch(chatId, patch) {
  await workflowStateStore.save(chatId, {
    ...patch,
    updated_at: new Date().toISOString(),
  });
}

async function beginSignIn(chatId, { greet = false } = {}) {
  const row = await workflowStateStore.get(chatId);
  if (row?.conversation_step) {
    await sendMessage(chatId, 'Complete sign-in or use /cancel first.');
    return;
  }
  if (greet) {
    await sendMessage(chatId, 'Welcome');
  }
  await workflowStateStore.save(chatId, {
    conversation_step: 'await_email',
    conversation_email: null,
  });
  await sendMessage(chatId, 'Enter email id');
}

async function handleConversationMessage(chatId, text, row) {
  const normalizedCancel = text.toLowerCase().replace(/^[/#]+/, '').trim();
  if (normalizedCancel === 'cancel') {
    await workflowStateStore.clearConversation(chatId);
    await sendMessage(chatId, 'Cancelled.');
    return true;
  }

  if (row.conversation_step === 'await_email') {
    const email = text.trim();
    if (!email.includes('@')) {
      await sendMessage(chatId, 'Please enter a valid email address.');
      return true;
    }
    const otp = generateOTP();
    await saveOTP(chatId, email, otp);
    const sent = await sendOTPEmail(email, otp, chatId);
    if (!sent) {
      await sendMessage(chatId, 'Could not send OTP email. Try again later.');
      return true;
    }
    await workflowStateStore.save(chatId, {
      conversation_step: 'await_otp',
      conversation_email: email,
    });
    await sendMessage(chatId, 'An OTP has been sent to your email. Please enter it below (expires in 5 minutes).');
    return true;
  }

  if (row.conversation_step === 'await_otp') {
    const email = row.conversation_email;
    const otpResult = await verifyOTP(chatId, text.trim());
    if (!otpResult.ok) {
      if (otpResult.reason === 'expired') {
        await workflowStateStore.save(chatId, {
          conversation_step: 'await_email',
          conversation_email: null,
        });
        await sendMessage(chatId, 'OTP expired. Please enter your email again.');
        return true;
      }
      await sendMessage(chatId, 'Invalid OTP. Please enter the OTP again.');
      return true;
    }

    await deleteOTP(chatId);
    await workflowStateStore.clearConversation(chatId);
    await sendMessage(chatId, 'Email verified!\nYour application process will start shortly.');

    const user = await findUserByEmail(email);
    if (!user) {
      await sendMessage(chatId, 'Email not found in our database. Please check and try again.');
      return true;
    }

    await linkTelegramChat(chatId, user.id);
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
    return true;
  }

  return false;
}

async function startNewday(chatId) {
  const row = await workflowStateStore.get(chatId);
  if (row?.session_deadline && Date.parse(row.session_deadline) > Date.now()) {
    await sendMessage(chatId, 'Your 9-hour job session is still active. Try /newday after it ends.');
    return;
  }

  const sessionRow = await getSessionRow(chatId);
  if (!sessionRow) {
    await sendMessage(chatId, 'Please sign in first with /start.');
    return;
  }

  const sessionStartedAt = Date.now();
  const sessionDeadline = sessionStartedAt + SESSION_MS;

  await persistWorkflowPatch(chatId, {
    session_started_at: new Date(sessionStartedAt).toISOString(),
    session_deadline: new Date(sessionDeadline).toISOString(),
    next_scan_at: new Date().toISOString(),
    consecutive_no_count: 0,
    current_prompt_token: null,
    current_prompt_url: null,
    current_prompt_sent_at: null,
    current_prompt_expires_at: null,
    current_prompt_queue_id: null,
    completion_notified: false,
    newday_requested_at: new Date(sessionStartedAt).toISOString(),
    last_decision: null,
    last_decision_at: null,
  });

  await audit(chatId, 'newday_started', {
    requestedAt: new Date(sessionStartedAt).toISOString(),
    jobsSince: new Date(sessionStartedAt - NEWDAY_LOOKBACK_MS).toISOString(),
  });
  await audit(chatId, 'session_started', {
    startedAt: new Date(sessionStartedAt).toISOString(),
    deadlineAt: new Date(sessionDeadline).toISOString(),
  });

  await sendMessage(chatId, 'New day started. I will send the first eligible job scraped within the last 24 hours.');
}

async function handleCommand(chatId, text) {
  const normalized = text.toLowerCase().replace(/^[/#]+/, '').trim();

  if (normalized === 'cancel') {
    await workflowStateStore.clearConversation(chatId);
    await sendMessage(chatId, 'Cancelled.');
    return;
  }

  const row = await workflowStateStore.get(chatId);
  if (row?.conversation_step) {
    await sendMessage(chatId, 'Complete sign-in or use /cancel first.');
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
    await beginSignIn(chatId, { greet: normalized === 'start' });
  }
}

async function handlePendingAnswerMessage(chatId, text) {
  const dbPendingQuestion = await findActivePendingQuestion(chatId);
  if (!dbPendingQuestion) return false;

  if (/^(\/)?skip$/i.test(text)) {
    await recordPendingAnswer(dbPendingQuestion.question_token, 'SKIPPED_BY_USER');
    await sendMessage(chatId, 'Application skipped as requested.');
    return true;
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
  return true;
}

async function handleJobCallback(chatId, data, decision) {
  const token = data.slice(decision === 'yes' ? 'job_yes_'.length : 'job_no_'.length);
  const row = await workflowStateStore.get(chatId);
  if (!row || row.current_prompt_token !== token) {
    return;
  }
  if (row.current_prompt_expires_at && Date.parse(row.current_prompt_expires_at) <= Date.now()) {
    return;
  }

  const recorded = await workflowStateStore.recordDecision(chatId, token, decision, Date.now()).catch(() => false);
  if (!recorded) {
    return;
  }

  await applyPromptDecision({
    chatId,
    decision,
    workflowRow: row,
    workflowStateStore,
    applyQueue,
    saveAppliedJob,
    audit,
    sendMessage,
    persistWorkflowPatch,
    getClientIdForChat,
  });
}

async function processMessageUpdate(ctx) {
  const chatId = ctx.message?.chat?.id;
  const updateId = ctx.update?.update_id;
  if (!chatId || (allowedChatId && chatId !== allowedChatId) || typeof ctx.message?.text !== 'string') {
    return;
  }

  const claimed = await workflowStateStore.claimTelegramUpdate(chatId, updateId);
  if (!claimed) return;

  const text = ctx.message.text.trim();

  try {
    if (await handlePendingAnswerMessage(chatId, text)) {
      return;
    }

    const row = await workflowStateStore.get(chatId);
    if (row?.conversation_step && await handleConversationMessage(chatId, text, row)) {
      return;
    }

    await handleCommand(chatId, text);
  } catch (error) {
    console.error(`[User ${chatId}] message handler failed:`, error.message);
    await sendMessage(chatId, `Operation failed: ${error.message}`).catch(() => {});
  }
}

async function processCallbackUpdate(ctx) {
  const chatId = ctx.from?.id;
  const data = ctx.callbackQuery?.data;
  const message = ctx.callbackQuery?.message;
  const updateId = ctx.update?.update_id;

  if (!chatId || !data) {
    return;
  }
  if (allowedChatId && chatId !== allowedChatId) {
    return;
  }

  const claimed = await workflowStateStore.claimTelegramUpdate(chatId, updateId);
  if (!claimed) return;

  try {
    await ctx.answerCallbackQuery().catch(() => {});
    if (message) {
      await bot.api.editMessageReplyMarkup({
        chat_id: message.chat?.id || chatId,
        message_id: message.message_id,
        reply_markup: { inline_keyboard: [] },
      }).catch(() => {});
    }
  } catch (error) {
    console.warn('[callback] failed to clear button markup:', error.message);
  }

  try {
    if (data.startsWith('job_yes_')) {
      await handleJobCallback(chatId, data, 'yes');
    } else if (data.startsWith('job_no_')) {
      await handleJobCallback(chatId, data, 'no');
    }
  } catch (error) {
    console.error(`[User ${chatId}] callback handler failed:`, error.message);
  }
}

bot.on('message', (ctx) => {
  processMessageUpdate(ctx).catch((error) => {
    console.error('[webhook] message processing error:', error.message);
  });
});

bot.on('callback_query', (ctx) => {
  processCallbackUpdate(ctx).catch((error) => {
    console.error('[webhook] callback processing error:', error.message);
  });
});

function createHttpServer() {
  const webhookServer = createWebhookServer(bot, {
    path: webhookPath,
    secretToken: webhookSecret,
  });

  return http.createServer((req, res) => {
    const path = (req.url || '/').split('?')[0];
    if (req.method === 'GET' && path === '/health') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('ok');
      return;
    }
    webhookServer.emit('request', req, res);
  });
}

async function startPollingMode() {
  console.log('[dice_telegram_bot] Starting Telegram polling (rollback mode)...');
  await bot.startPolling();
}

async function startWebhookMode() {
  httpServer = createHttpServer();
  await new Promise((resolve, reject) => {
    httpServer.once('error', reject);
    httpServer.listen(listenPort, '0.0.0.0', resolve);
  });
  console.log(`[dice_telegram_bot] HTTP listening on ${listenPort} (${webhookPath}, /health)`);

  await bot.api.setWebhook({
    url: webhookUrl,
    secret_token: webhookSecret,
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: false,
  });
  console.log('[dice_telegram_bot] Webhook registered.');
}

(async () => {
  console.log('[dice_telegram_bot] Testing bot token...');
  await bot.api.getMe();
  console.log('[dice_telegram_bot] Bot token verified.');

  dueWorkTicker = createDueWorkTicker({
    getClientIdForChat,
    loadApplyProfile,
    readJobUrls: require('./lib/job-scanner').readJobUrls,
    applyQueue,
    saveAppliedJob,
    workflowStateStore,
    audit,
    sendMessage,
    sendMessageWithButtons,
    azure,
  });
  dueWorkTicker.start();

  if (telegramMode === 'polling') {
    await startPollingMode();
  } else {
    await startWebhookMode();
  }

  console.log('[dice_telegram_bot] Telegram controller is running.');
})().catch((error) => {
  console.error(`Could not start dice_telegram_bot: ${error.message}`);
  process.exit(1);
});

async function shutdown() {
  console.log('[dice_telegram_bot] Shutting down...');
  if (dueWorkTicker) dueWorkTicker.stop();
  if (bot.isRunning()) await bot.stopPolling().catch(() => {});
  if (httpServer) {
    await new Promise((resolve) => httpServer.close(resolve));
  }
  process.exit(0);
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

module.exports = {
  bot,
  workflowStateStore,
  beginSignIn,
  startNewday,
  handleJobCallback,
  persistWorkflowPatch,
};
