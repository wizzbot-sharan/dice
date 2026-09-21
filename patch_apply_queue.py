import re

with open('lib/apply-queue.js', 'r') as f:
    code = f.read()

# 1. Update enqueueApplyJob to support custom initial status (default 'queued')
old_enqueue_sig = "async function enqueueApplyJob({"
new_enqueue_sig = "async function enqueueApplyJob({"
# wait, actually let's just find the function body

old_enqueue = """async function enqueueApplyJob({
    clientId,
    telegramChatId,
    jobId = null,
    url,
    availableAt = new Date().toISOString(),
  }) {"""
new_enqueue = """async function enqueueApplyJob({
    clientId,
    telegramChatId,
    jobId = null,
    url,
    status = 'queued',
    availableAt = new Date().toISOString(),
  }) {"""
code = code.replace(old_enqueue, new_enqueue)

# replace instances of 'queued' inside enqueueApplyJob inserting it
# "status: 'queued'," -> "status,"
code = code.replace("status: 'queued',", "status,")
code = code.replace("status = 'queued'", "status = 'queued'") # rollback if it accidentally touched the signature? No, status, handles it.
# Actually let's be safe. I will use regex to replace only inside insert({ ... status: 'queued' })
code = re.sub(r"insert\(\{([^}]*)status: 'queued',([^}]*)\}\)", r"insert({\1status,\2})", code)

# also the ON CONFLICT query:
# INSERT INTO dice_apply_queue (client_id, telegram_chat_id, job_id, url, status, available_at)
# VALUES ($1, $2, $3, $4, 'queued', $5)
code = code.replace("VALUES ($1, $2, $3, $4, 'queued', $5)", "VALUES ($1, $2, $3, $4, $6, $5)")
code = code.replace("[clientId, telegramChatId, jobId, url, availableAt]", "[clientId, telegramChatId, jobId, url, availableAt, status]")

# 2. Add raw claim query for preflight jobs
old_claim = """  async function claimNextJob(workerId) {
    const { data, error } = await azure.rpc('claim_apply_queue_job_ready', {
      p_worker_id: workerId,
      p_stale_minutes: 20,
    });
    if (error) throw new Error(`claim_apply_queue_job failed: ${error.message}`);
    if (!data || (Array.isArray(data) && data.length === 0)) return null;
    return Array.isArray(data) ? data[0] : data;
  }"""

new_claim = """  async function claimNextJob(workerId) {
    const { data, error } = await azure.rpc('claim_apply_queue_job_ready', {
      p_worker_id: workerId,
      p_stale_minutes: 20,
    });
    if (error) throw new Error(`claim_apply_queue_job failed: ${error.message}`);
    if (data && (Array.isArray(data) ? data.length > 0 : true)) {
      return Array.isArray(data) ? data[0] : data;
    }
    
    // Fallback: claim 'preflight_queued' jobs if no 'queued' jobs are ready
    try {
      const { createPool } = require('./azure');
      const pool = createPool();
      const res = await pool.query(`
        UPDATE dice_apply_queue
        SET status = 'running',
            worker_id = $1,
            locked_at = now(),
            started_at = coalesce(started_at, now())
        WHERE id = (
          SELECT id FROM dice_apply_queue
          WHERE status = 'preflight_queued'
            AND (available_at IS NULL OR available_at <= now())
            AND (locked_at IS NULL OR locked_at < now() - interval '20 minutes')
          ORDER BY created_at ASC
          FOR UPDATE SKIP LOCKED
          LIMIT 1
        )
        RETURNING *
      `, [workerId]);
      if (res.rows && res.rows.length > 0) {
        return res.rows[0];
      }
    } catch (err) {
      console.error('Failed to claim preflight job:', err.message);
    }
    return null;
  }"""
code = code.replace(old_claim, new_claim)

# 3. Add updateJobStatus
new_update_status = """
  async function updateJobStatus(queueId, status, extraFields = {}) {
    const { error } = await azure
      .from('dice_apply_queue')
      .update({
        status,
        ...extraFields
      })
      .eq('id', queueId);
    if (error) console.error(`Failed to update queue ${queueId} status to ${status}:`, error.message);
  }

  async function getReadyPreflightPassedJobs(clientId) {
    const { data, error } = await azure
      .from('dice_apply_queue')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', 'preflight_passed')
      .order('created_at', { ascending: true })
      .limit(10);
    if (error) {
      console.error('Failed to fetch preflight_passed jobs:', error.message);
      return [];
    }
    return data || [];
  }
"""

if "updateJobStatus" not in code:
    code = code.replace("return {", new_update_status + "\n  return {")
    code = code.replace("enqueueApplyJob,", "enqueueApplyJob,\n    updateJobStatus,\n    getReadyPreflightPassedJobs,")

with open('lib/apply-queue.js', 'w') as f:
    f.write(code)

print("Patched apply-queue.js successfully.")
