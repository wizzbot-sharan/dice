const { createServiceClient, createPool } = require('./azure');
const { getClientIdForChat } = require('./dice-session');
const { createApplyQueue } = require('./apply-queue');
const { getClientPrefix, getJobDisplay } = require('./logger');

const azure = createServiceClient();
const applyQueue = createApplyQueue(azure);

async function saveAppliedJob(chatId, url, jobName, status, reason = null) {
  const clientId = await getClientIdForChat(chatId);
  const userPrefix = await getClientPrefix({ chatId, clientId });
  if (!clientId) {
    console.error(`${userPrefix} Cannot save application: no linked client.`);
    return;
  }

  const { data: job } = await azure.from('dice_scraped_jobs').select('id, title, company').eq('url', url).maybeSingle();
  const jobDisplay = job && job.title ? await getJobDisplay(job) : await getJobDisplay(url);
  const { error } = await azure.from('dice_applied_jobs').upsert(
    {
      client_id: clientId,
      telegram_chat_id: chatId,
      job_id: job?.id || null,
      url,
      job_name: jobName || (job?.title ? `${job.company ? `${job.company} - ` : ''}${job.title}` : 'Unknown Job'),
      status,
      reason,
      applied_at: new Date().toISOString(),
    },
    { onConflict: 'client_id,url' }
  );

  if (error) {
    console.error(`${userPrefix} Failed to save application:`, error.message);
    return;
  }
  console.log(`${userPrefix} Saved job decision: ${status}${reason ? ` (${reason})` : ''} for ${jobDisplay}`);
}

async function hasHandledJob(chatId, url) {
  const clientId = await getClientIdForChat(chatId);
  if (!clientId) return false;

  const { data, error } = await azure
    .from('dice_applied_jobs')
    .select('id')
    .eq('client_id', clientId)
    .eq('url', url)
    .maybeSingle();

  if (error) {
    console.error(`${await getClientPrefix(chatId)} Failed to check applications:`, error.message);
    return false;
  }
  if (data) {
    await applyQueue.clearStaleClientJobs(clientId).catch(() => { });
    return true;
  }

  const handled = await applyQueue.hasActiveOrFinishedQueueItem(clientId, url);
  if (handled) {
    await applyQueue.clearStaleClientJobs(clientId).catch(() => { });
  }
  return handled;
}

module.exports = {
  saveAppliedJob,
  hasHandledJob,
  applyQueue,
};

async function patchJobProof(chatId, url, screenshotLink, emailJson) {
  const pool = createPool();
  try {
    const res = await pool.query(
      `UPDATE dice_applied_jobs 
       SET screenshot_link = $1, email_json = $2 
       WHERE telegram_chat_id = $3 AND url = $4
       RETURNING id`,
      [screenshotLink, JSON.stringify(emailJson), String(chatId), url]
    );
    if (res.rowCount > 0) {
      console.log(`[db] Patched proof for job ${url}`);
    } else {
      console.warn(`[db] Job not found for proof patching: ${url}`);
    }
  } catch (err) {
    console.error(`[db] Failed to patch proof for job: ${err.message}`);
  }
}

module.exports.patchJobProof = patchJobProof;
