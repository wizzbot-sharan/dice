const { createPool } = require('./azure');

const NEWDAY_LOOKBACK_MS = 24 * 60 * 60 * 1000;

/**
 * Reads unhandled jobs for a given client and applywizz_id.
 * By default returns all unhandled jobs (preflightStatus = 'all').
 */
async function readJobUrls(clientId, applywizzId, scrapedAfter = Date.now() - NEWDAY_LOOKBACK_MS, options = {}) {
  if (!applywizzId || !clientId) return [];

  const pool = createPool();
  const scrapedAfterIso = new Date(scrapedAfter || (Date.now() - NEWDAY_LOOKBACK_MS)).toISOString();
  const preflightStatus = options.preflightStatus !== undefined ? options.preflightStatus : 'all';

  try {
    let query = `
      SELECT j.id, j.url, j.title, j.company, j.applywizz_id, j.company_email, j.scraped_at, j.preflight_status
      FROM dice_scraped_jobs j
      WHERE j.applywizz_id = $1
        AND j.scraped_at >= $2::timestamptz
        AND NOT EXISTS (
          SELECT 1 FROM dice_applied_jobs a
          WHERE a.client_id = $3 AND a.url = j.url
        )
        AND NOT EXISTS (
          SELECT 1 FROM dice_apply_queue q
          WHERE q.client_id = $3 AND q.url = j.url
        )
    `;
    const params = [applywizzId, scrapedAfterIso, clientId];

    if (preflightStatus !== null && preflightStatus !== 'all') {
      params.push(preflightStatus);
      query += ` AND j.preflight_status = $${params.length}`;
    }

    query += ` ORDER BY j.scraped_at DESC LIMIT 50`;

    const result = await pool.query(query, params);

    return (result.rows || []).map((job) => ({
      id: job.id,
      url: job.url,
      title: job.title,
      company: job.company,
      applywizzId: job.applywizz_id,
      companyEmail: job.company_email,
      scrapedAt: job.scraped_at,
      preflightStatus: job.preflight_status,
    }));
  } catch (error) {
    console.error('Failed to load unhandled jobs:', error.message);
    return [];
  }
}

async function getJobsPendingPreflight(limit = 10) {
  const pool = createPool();
  try {
    const result = await pool.query(
      `SELECT id, url, title, company, applywizz_id, company_email, scraped_at
       FROM dice_scraped_jobs
       WHERE preflight_status IS NULL
       ORDER BY scraped_at DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows || [];
  } catch (error) {
    console.error('Failed to load jobs pending preflight:', error.message);
    return [];
  }
}

async function updateJobPreflightStatus(jobId, status) {
  const pool = createPool();
  try {
    await pool.query(
      `UPDATE dice_scraped_jobs
       SET preflight_status = $2
       WHERE id = $1`,
      [jobId, status]
    );
  } catch (error) {
    console.error(`Failed to update preflight_status for job ${jobId}:`, error.message);
  }
}

module.exports = {
  NEWDAY_LOOKBACK_MS,
  readJobUrls,
  getJobsPendingPreflight,
  updateJobPreflightStatus,
};
