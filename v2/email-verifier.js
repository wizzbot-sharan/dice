const { createPool } = require('../lib/azure');
const { verifyJobApplicationEmail } = require('../lib/zoho-mail-reader');

async function runEmailVerifier() {
  const pool = createPool();
  try {
    const res = await pool.query(`
      SELECT a.id, a.applywizz_id, a.job_url, a.email_verification_attempts,
             j.company_email, j.company, j.title
      FROM dice_applied_jobs_v2 a
      JOIN dice_scraped_jobs j ON a.job_url = j.url AND a.applywizz_id = j.applywizz_id
      WHERE a.status = 'pending_email' AND a.email_verification_attempts < 10
      ORDER BY a.applied_at ASC
    `);

    for (const job of res.rows) {
      console.log(`[V2 Email Verifier] Checking email for ${job.applywizz_id} - ${job.company}`);
      
      await pool.query(
        `UPDATE dice_applied_jobs_v2 SET email_verification_attempts = email_verification_attempts + 1 WHERE id = $1`,
        [job.id]
      );

      try {
        const isVerified = await verifyJobApplicationEmail(job.company_email, job.company, job.title);
        
        if (isVerified) {
          console.log(`[V2 Email Verifier] Verified ${job.applywizz_id} - ${job.company}`);
          await pool.query(
            `UPDATE dice_applied_jobs_v2 SET status = 'verified_email', verified_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [job.id]
          );
        }
      } catch (err) {
        console.error(`[V2 Email Verifier] Error checking email for ${job.id}:`, err.message);
      }
    }

    await pool.query(`
      UPDATE dice_applied_jobs_v2 
      SET status = 'failed' 
      WHERE status = 'pending_email' AND email_verification_attempts >= 10
    `);

  } catch (err) {
    console.error('[V2 Email Verifier] Overall Error:', err);
  }
}

function startEmailVerifier() {
  console.log('[V2 Email Verifier] Starting background email check (every 1 min)');
  runEmailVerifier();
  setInterval(runEmailVerifier, 60 * 1000);
}

module.exports = { startEmailVerifier, runEmailVerifier };
