const { createPool } = require('../lib/azure');
const { blindApply } = require('./blind-apply');
const { verifyJobApplicationEmail } = require('../lib/zoho-mail-reader');

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
    let finalError = result.screenshotError || null;
    let finalStatus = 'completed';

    // Synchronous Zoho Email Verification (exactly like V1)
    console.log(`[V2 Worker ${workerId}] Starting Zoho verification for ${job.applywizz_id}...`);
    try {
      const jobRes = await pool.query(`SELECT company, title, company_email FROM dice_scraped_jobs WHERE applywizz_id = $1 AND job_id = $2`, [job.applywizz_id, job.job_id]);
      if (jobRes.rows.length > 0) {
        const { company, title, company_email } = jobRes.rows[0];
        const mailResult = await verifyJobApplicationEmail(company_email, company, title, null);
        
        if (mailResult && mailResult.status === 'proof_failed') {
          const zohoErr = mailResult.error || 'Email not found';
          finalError = finalError ? finalError + ' | Zoho failed: ' + zohoErr : 'Zoho verification failed: ' + zohoErr;
        } else if (mailResult && mailResult.status === 'reader not configured') {
          finalError = finalError ? finalError + ' | Zoho failed: reader not configured' : 'Zoho failed: reader not configured';
        }
      } else {
         finalError = finalError ? finalError + ' | Zoho failed: Job data missing' : 'Zoho failed: Job data missing';
      }
    } catch (e) {
      finalError = finalError ? finalError + ' | Zoho failed: ' + e.message : 'Zoho verification failed: ' + e.message;
    }

    await pool.query(`UPDATE dice_apply_queue_v2 SET status = 'success' WHERE id = $1`, [job.id]);
    
    // Insert into applied_jobs_v2
    await pool.query(`
      INSERT INTO dice_applied_jobs_v2 (applywizz_id, job_id, job_url, status, screenshot_url, error_message, verified_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
    `, [job.applywizz_id, job.job_id, job.job_url, finalStatus, result.screenshotUrl || null, finalError]);
    
    console.log(`[V2 Worker ${workerId}] Successfully applied and verified ${job.applywizz_id} to ${job.job_url}`);
  } else {
    // result.errorType will be either 'preflight_failed' or 'apply_failed'
    await pool.query(
      `UPDATE dice_apply_queue_v2 SET status = $1, error_message = $2 WHERE id = $3`, 
      [result.errorType, result.error, job.id]
    );
    
    // Insert the failed attempt into dice_applied_jobs_v2
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
