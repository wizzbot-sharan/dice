const { createPool } = require('../lib/azure');
const { blindApply } = require('./blind-apply');

const WORKER_COUNT = 5;

async function processQueueItem(workerId) {
  const pool = createPool();
  
  const res = await pool.query(`
    UPDATE dice_apply_queue_v2
    SET status = 'processing', processed_at = CURRENT_TIMESTAMP
    WHERE id = (
      SELECT id FROM dice_apply_queue_v2
      WHERE status = 'pending'
      ORDER BY created_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING *;
  `);

  if (res.rows.length === 0) {
    return false;
  }

  const job = res.rows[0];
  console.log(`[V2 Worker ${workerId}] processing queue item ${job.id} for ${job.applywizz_id}`);

  const result = await blindApply(job.applywizz_id, job.job_url, job.job_id);

  if (result.success) {
    await pool.query(`UPDATE dice_apply_queue_v2 SET status = 'success' WHERE id = $1`, [job.id]);
    
    // Insert into applied_jobs_v2. Status is pending_email so the verifier picks it up.
    await pool.query(`
      INSERT INTO dice_applied_jobs_v2 (applywizz_id, job_id, job_url, status, screenshot_url, error_message)
      VALUES ($1, $2, $3, 'pending_email', $4, $5)
    `, [job.applywizz_id, job.job_id, job.job_url, result.screenshotUrl || null, result.screenshotError || null]);
    
    console.log(`[V2 Worker ${workerId}] Successfully applied for ${job.applywizz_id} to ${job.job_url}`);
  } else {
    // result.errorType will be either 'preflight_failed' or 'apply_failed'
    await pool.query(
      `UPDATE dice_apply_queue_v2 SET status = $1, error_message = $2 WHERE id = $3`, 
      [result.errorType, result.error, job.id]
    );
    
    // Insert the failed attempt into dice_applied_jobs_v2 so we track it there instead of dice_scraped_jobs
    await pool.query(`
      INSERT INTO dice_applied_jobs_v2 (applywizz_id, job_id, job_url, status, error_message)
      VALUES ($1, $2, $3, $4, $5)
    `, [job.applywizz_id, job.job_id, job.job_url, result.errorType, result.error]);
    
    console.log(`[V2 Worker ${workerId}] ${result.errorType.toUpperCase()} for ${job.applywizz_id}: ${result.error}`);
  }

  return true;
}

async function workerLoop(workerId) {
  while (true) {
    try {
      const didWork = await processQueueItem(workerId);
      if (!didWork) {
        await new Promise(r => setTimeout(r, 5000));
      }
    } catch (e) {
      console.error(`[V2 Worker ${workerId}] Error in worker loop:`, e);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

function startWorkers() {
  console.log(`[V2 Workers] Starting ${WORKER_COUNT} concurrent workers`);
  for (let i = 1; i <= WORKER_COUNT; i++) {
    workerLoop(i);
  }
}

module.exports = { startWorkers };
