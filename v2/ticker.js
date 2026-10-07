const { createPool } = require('../lib/azure');

const V2_DAILY_LIMIT = parseInt(process.env.V2_DAILY_LIMIT || '10', 10);
const V2_COOLDOWN_MIN = parseInt(process.env.V2_COOLDOWN_MIN || '20', 10);
const V2_COOLDOWN_MAX = parseInt(process.env.V2_COOLDOWN_MAX || '30', 10);

async function runTicker() {
  const pool = createPool();
  try {
    // 0. RESCUE OPERATION: If a worker crashed while a job was 'processing' (e.g. Railway restarted), 
    // reset it back to 'pending' after 15 minutes so it doesn't block the user forever.
    await pool.query(`
      UPDATE dice_apply_queue_v2
      SET status = 'pending', processed_at = NULL
      WHERE status = 'processing' 
        AND processed_at < CURRENT_TIMESTAMP - INTERVAL '15 minutes'
    `);

    // 1. Get all active clients
    const clientsResult = await pool.query(`SELECT applywizz_id FROM clients_additional_info WHERE applywizz_id IS NOT NULL`);
    const applywizzIds = clientsResult.rows.map(r => r.applywizz_id).filter(Boolean);

    for (const applywizzId of applywizzIds) {
      // 2. Check if there is already a job in the queue
      const queuedResult = await pool.query(
        `SELECT id FROM dice_apply_queue_v2 WHERE applywizz_id = $1 AND status IN ('pending', 'processing') LIMIT 1`,
        [applywizzId]
      );
      if (queuedResult.rows.length > 0) {
        // Already in queue, skip pulling from scraped jobs
        continue;
      }

      // 3. Check daily limit and cooldown based on actual completed applications
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);

      const appliedResult = await pool.query(
        `SELECT 
           COUNT(*) as daily_count, 
           MAX(applied_at) as last_applied_at 
         FROM dice_applied_jobs_v2 
         WHERE applywizz_id = $1 AND applied_at >= $2`,
        [applywizzId, todayStart.toISOString()]
      );

      const dailyCount = parseInt(appliedResult.rows[0]?.daily_count || '0', 10);
      if (dailyCount >= V2_DAILY_LIMIT) {
        continue; // Limit reached for today
      }

      const lastAppliedAt = appliedResult.rows[0]?.last_applied_at;
      if (lastAppliedAt) {
        const timeSinceLastApplyMs = Date.now() - new Date(lastAppliedAt).getTime();
        const minGapMs = V2_COOLDOWN_MIN * 60 * 1000;
        if (timeSinceLastApplyMs < minGapMs) {
          continue; // Cooldown not yet reached
        }
      }

      // 4. Eligible! Fetch ONE new job
      const jobResult = await pool.query(
        `SELECT id, url, title, company 
         FROM dice_scraped_jobs 
         WHERE applywizz_id = $1 
           AND (preflight_status = 'passed' OR preflight_status IS NULL OR preflight_status = 'pending')
           AND NOT EXISTS (
             SELECT 1 FROM dice_applied_jobs_v2 WHERE dice_applied_jobs_v2.job_url = dice_scraped_jobs.url AND dice_applied_jobs_v2.applywizz_id = $1
           )
           AND NOT EXISTS (
             SELECT 1 FROM dice_apply_queue_v2 WHERE dice_apply_queue_v2.job_url = dice_scraped_jobs.url AND dice_apply_queue_v2.applywizz_id = $1
           )
         LIMIT 1`,
        [applywizzId]
      );

      if (jobResult.rows.length > 0) {
        const job = jobResult.rows[0];
        await pool.query(
          `INSERT INTO dice_apply_queue_v2 (applywizz_id, job_id, job_url, status) VALUES ($1, $2, $3, 'pending')`,
          [applywizzId, job.id, job.url]
        );
        console.log(`[V2 Ticker] Queued job ${job.id} for client ${applywizzId}`);
      }
    }
  } catch (error) {
    console.error('[V2 Ticker] Error running ticker:', error);
  }
}

function startTicker() {
  console.log('[V2 Ticker] Starting orchestrator ticker (every 2 mins)');
  runTicker();
  setInterval(runTicker, 2 * 60 * 1000);
}

module.exports = { startTicker, runTicker };
