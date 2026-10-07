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
    await pool.query(`
      INSERT INTO dice_applied_jobs_v2 (applywizz_id, job_id, job_url, status, screenshot_url)
      VALUES ($1, $2, $3, 'pending_email', $4)
    `, [job.applywizz_id, job.job_id, job.job_url, result.screenshotUrl]);
    console.log(`[V2 Worker ${workerId}] Successfully applied for ${job.applywizz_id} to ${job.job_url}`);
  } else {
    // result.errorType will be either 'preflight_failed' or 'failed'
    await pool.query(
      `UPDATE dice_apply_queue_v2 SET status = $1, error_message = $2 WHERE id = $3`, 
      [result.errorType, result.error, job.id]
    );
    
    // Update the scraped jobs table so the ticker knows it failed preflight if necessary
    if (result.errorType === 'preflight_failed') {
       await pool.query(
         `UPDATE dice_scraped_jobs SET preflight_status = 'failed' WHERE url = $1 AND applywizz_id = $2`,
         [job.job_url, job.applywizz_id]
       );
    }
    
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
