const { createPool } = require('./azure');
const { NEWDAY_LOOKBACK_MS } = require('./job-scanner');
const { applyPromptDecision, sendJobPrompt, randomMinutes } = require('./bot-prompt-handler');

const ENQUEUE_BATCH_CAP = Number(process.env.BOT_ENQUEUE_BATCH_CAP || 5);
const TICKER_BATCH_SIZE = Number(process.env.BOT_TICKER_BATCH_SIZE || 20);
const TICKER_INTERVAL_MS = Number(process.env.BOT_TICKER_INTERVAL_MS || 3000);
const SEND_SPACING_MS = Number(process.env.BOT_SEND_SPACING_MS || 150);

async function listDueWorkflowChats(limit = TICKER_BATCH_SIZE) {
  let pool;
  try {
    pool = createPool();
  } catch {
    return [];
  }
  try {
    const result = await pool.query(
      `SELECT w.telegram_chat_id, w.*
         FROM dice_workflow_sessions w
        WHERE w.session_deadline IS NOT NULL
          AND w.session_deadline > now()
          AND (
            (
              w.current_prompt_token IS NOT NULL
              AND w.current_prompt_expires_at IS NOT NULL
              AND w.current_prompt_expires_at <= now()
            )
            OR (
              w.current_prompt_token IS NULL
              AND (w.next_scan_at IS NULL OR w.next_scan_at <= now())
            )
          )
        ORDER BY w.next_scan_at NULLS FIRST, w.session_deadline ASC
        LIMIT $1`,
      [limit],
    );
    return result.rows || [];
  } catch (error) {
    console.error('[due-ticker] listDueWorkflowChats failed:', error.message);
    return [];
  }
}

function createDueWorkTicker(deps) {
  const {
    getClientIdForChat,
    loadApplyProfile,
    readJobUrls,
    applyQueue,
    saveAppliedJob,
    workflowStateStore,
    audit,
    sendMessage,
    sendMessageWithButtons,
    azure,
  } = deps;

  let tickerRunning = false;
  let tickerTimer = null;

  async function persistWorkflowPatch(chatId, patch) {
    await workflowStateStore.save(chatId, {
      ...patch,
      updated_at: new Date().toISOString(),
    });
  }

  async function processDueChat(row) {
    const chatId = Number(row.telegram_chat_id);
    const sessionDeadline = Date.parse(row.session_deadline);

    if (row.current_prompt_token && row.current_prompt_expires_at) {
      const expiresAt = Date.parse(row.current_prompt_expires_at);
      if (expiresAt <= Date.now()) {
        await applyPromptDecision({
          chatId,
          decision: 'missed',
          workflowRow: row,
          workflowStateStore,
          applyQueue,
          saveAppliedJob,
          audit,
          sendMessage,
          persistWorkflowPatch,
          getClientIdForChat,
        });
        return;
      }
    }

    if (Date.now() >= sessionDeadline) {
      if (row.last_decision !== 'expired') {
        await sendMessage(chatId, 'The 9-hour job application window has ended.');
        await persistWorkflowPatch(chatId, {
          last_decision: 'expired',
          last_decision_at: new Date().toISOString(),
        });
      }
      return;
    }

    if (row.current_prompt_token) {
      return;
    }

    const clientId = await getClientIdForChat(chatId);
    if (!clientId) {
      await persistWorkflowPatch(chatId, {
        next_scan_at: new Date(Date.now() + 60000).toISOString(),
      });
      return;
    }

    const activeQueueCount = await applyQueue.countActiveQueueItems(clientId);
    const applyProfile = await loadApplyProfile(azure, clientId);
    const newdayRequestedAt = row.newday_requested_at
      ? Date.parse(row.newday_requested_at)
      : Date.now();
    const scrapedAfter = newdayRequestedAt - NEWDAY_LOOKBACK_MS;

    if (activeQueueCount === 0) {
      const jobs = await readJobUrls(clientId, applyProfile.applywizz_id, scrapedAfter);
      const batch = jobs.slice(0, ENQUEUE_BATCH_CAP);
      if (batch.length > 0) {
        console.log(`[User ${chatId}] Enqueueing ${batch.length} job(s) for preflight.`);
        for (const job of batch) {
          if (String(job.applywizzId || '') !== String(applyProfile.applywizz_id || '')) {
            continue;
          }
          try {
            await applyQueue.enqueueApplyJob({
              clientId,
              telegramChatId: chatId,
              jobId: job.id,
              url: job.url,
              status: 'preflight_queued',
              availableAt: new Date().toISOString(),
            });
          } catch (err) {
            console.error(`[User ${chatId}] Failed to enqueue preflight:`, err.message);
          }
        }
        await persistWorkflowPatch(chatId, {
          completion_notified: false,
          next_scan_at: new Date(Date.now() + 5000).toISOString(),
        });
        return;
      }

      const activeClientJob = await applyQueue.hasActiveClientJob(clientId);
      if (!row.completion_notified && !activeClientJob) {
        await audit(chatId, 'all_jobs_completed', { checkedAt: new Date().toISOString() });
        const messageText = jobs.length === 0
          ? 'Scanning Dice for new jobs. I will notify you when matching jobs appear.'
          : 'All jobs from the CSV have been completed. I will wait for new job links.';
        const sent = await sendMessage(chatId, messageText);
        if (sent) {
          await persistWorkflowPatch(chatId, { completion_notified: true });
        }
      }
      await persistWorkflowPatch(chatId, {
        next_scan_at: new Date(Date.now() + 30000).toISOString(),
      });
      return;
    }

    const readyJobs = await applyQueue.getReadyPreflightPassedJobs(clientId);
    if (readyJobs.length > 0) {
      const job = readyJobs[0];
      await sendJobPrompt({
        chatId,
        job,
        sessionDeadlineMs: sessionDeadline,
        workflowStateStore,
        applyQueue,
        audit,
        sendMessageWithButtons,
        persistWorkflowPatch,
      });
      return;
    }

    await persistWorkflowPatch(chatId, {
      next_scan_at: new Date(Date.now() + 5000).toISOString(),
    });
  }

  async function tick() {
    if (tickerRunning) return;
    tickerRunning = true;
    try {
      const rows = await listDueWorkflowChats(TICKER_BATCH_SIZE);
      for (const row of rows) {
        try {
          await processDueChat(row);
          if (SEND_SPACING_MS > 0) {
            await new Promise((r) => setTimeout(r, SEND_SPACING_MS));
          }
        } catch (error) {
          console.error(`[due-ticker] chat ${row.telegram_chat_id} failed:`, error.message);
        }
      }
    } catch (error) {
      console.error('[due-ticker] tick failed:', error.message);
    } finally {
      tickerRunning = false;
    }
  }

  function start() {
    if (tickerTimer) return;
    tickerTimer = setInterval(() => {
      tick().catch((err) => console.error('[due-ticker] interval error:', err.message));
    }, TICKER_INTERVAL_MS);
    tick().catch(() => {});
    console.log(`[due-ticker] started (every ${TICKER_INTERVAL_MS}ms, batch ${TICKER_BATCH_SIZE})`);
  }

  function stop() {
    if (tickerTimer) {
      clearInterval(tickerTimer);
      tickerTimer = null;
    }
  }

  return { start, stop, tick, processDueChat, listDueWorkflowChats };
}

module.exports = {
  createDueWorkTicker,
  listDueWorkflowChats,
  ENQUEUE_BATCH_CAP,
  TICKER_BATCH_SIZE,
};
