const { createServiceClient } = require('./azure');
const { getClientIdForChat } = require('./dice-session');
const { createApplyQueue } = require('./apply-queue');

const azure = createServiceClient();
const applyQueue = createApplyQueue(azure);

async function saveAppliedJob(chatId, url, jobName, status, reason = null) {
  const clientId = await getClientIdForChat(chatId);
  if (!clientId) {
    console.error(`[User ${chatId}] Cannot save application: no linked client.`);
    return;
  }

  const { data: job } = await azure.from('dice_scraped_jobs').select('id').eq('url', url).maybeSingle();
  const { error } = await azure.from('dice_applied_jobs').upsert(
    {
      client_id: clientId,
      telegram_chat_id: chatId,
      job_id: job?.id || null,
      url,
      job_name: jobName || 'Unknown Job',
      status,
      reason,
      applied_at: new Date().toISOString(),
    },
    { onConflict: 'client_id,url' }
  );

  if (error) {
    console.error(`[User ${chatId}] Failed to save application:`, error.message);
    return;
  }
  console.log(`[User ${chatId}] Saved job decision: ${status}${reason ? ` (${reason})` : ''} for ${url}`);
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
    console.error(`[User ${chatId}] Failed to check applications:`, error.message);
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
