const { createPool } = require('../lib/azure');
const { blindApply } = require('./blind-apply');

// We have 5 workers to handle the queue concurrently
const WORKER_COUNT = 5;

async function processQueueItem(workerId) {
  const pool = createPool();
  
  // Using FOR UPDATE SKIP LOCKED to prevent workers from picking the same job
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
    return false; // No jobs
  }

  const job = res.rows[0];
  console.log(`[V2 Worker ${workerId}] processing queue item ${job.id} for ${job.applywizz_id}`);

  // 2. Do the blind apply
  const result = await blindApply(job.applywizz_id, job.job_url, job.job_id);

  // 3. Update states
  if (result.success) {
    await pool.query(`UPDATE dice_apply_queue_v2 SET status = 'success' WHERE id = $1`, [job.id]);
    await pool.query(`
      INSERT INTO dice_applied_jobs_v2 (applywizz_id, job_id, job_url, status, screenshot_url)
      VALUES ($1, $2, $3, 'pending_email', $4)
    `, [job.applywizz_id, job.job_id, job.job_url, result.screenshotUrl]);
    console.log(`[V2 Worker ${workerId}] Successfully applied for ${job.applywizz_id} to ${job.job_url}`);
  } else {
    await pool.query(`UPDATE dice_apply_queue_v2 SET status = 'failed', error_message = $1 WHERE id = $2`, [result.error, job.id]);
    console.log(`[V2 Worker ${workerId}] Failed apply for ${job.applywizz_id}: ${result.error}`);
  }

  return true; // We processed a job, maybe there are more
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
