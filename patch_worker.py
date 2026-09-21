import re

with open('lib/apply-worker.js', 'r') as f:
    code = f.read()

# 1. Update startApplyWorkers signature
old_sig = "function startApplyWorkers({"
new_sig = "function startApplyWorkers({\n  preflightJob,"
code = code.replace(old_sig, new_sig)

old_param = "@param {(job: object) => Promise<void>} options.executeJob"
new_param = "@param {(job: object) => Promise<void>} options.executeJob\n * @param {(job: object) => Promise<void>} options.preflightJob"
code = code.replace(old_param, new_param)

# 2. Add branching in workerLoop
old_exec = """        if (applyTimeoutMs && applyTimeoutMs > 0) {
          const ac = new AbortController();
          let timer = null;
          try {
            const timeoutPromise = new Promise((_, reject) => {
              timer = setTimeout(() => {
                ac.abort();
                const minutes = Math.round(applyTimeoutMs / 60000);
                const timeoutError = new Error(`Application timed out after ${minutes} min`);
                timeoutError.code = 'APPLY_TIMEOUT';
                reject(timeoutError);
              }, applyTimeoutMs);
            });
            await Promise.race([
              executeJob(job, { signal: ac.signal }),
              timeoutPromise,
            ]);
          } finally {
            if (timer) clearTimeout(timer);
          }
        } else {
          await executeJob(job);
        }

        await queue.markCompleted(job.id);
        console.log(`[queue-worker ${workerId}] completed ${job.id}`);
        await audit(Number(job.telegram_chat_id), 'automation_completed', {
          queueId: job.id,
          workerId,
          completedAt: new Date().toISOString(),
        }).catch(() => {});"""

new_exec = """        if (job.status === 'preflight_running' && preflightJob) {
          // Preflight execution
          await preflightJob(job);
          await queue.updateJobStatus(job.id, 'preflight_passed');
          console.log(`[queue-worker ${workerId}] preflight passed ${job.id}`);
          await audit(Number(job.telegram_chat_id), 'preflight_completed', {
            queueId: job.id,
            workerId,
            completedAt: new Date().toISOString(),
          }).catch(() => {});
        } else {
          // Normal execution
          if (applyTimeoutMs && applyTimeoutMs > 0) {
            const ac = new AbortController();
            let timer = null;
            try {
              const timeoutPromise = new Promise((_, reject) => {
                timer = setTimeout(() => {
                  ac.abort();
                  const minutes = Math.round(applyTimeoutMs / 60000);
                  const timeoutError = new Error(`Application timed out after ${minutes} min`);
                  timeoutError.code = 'APPLY_TIMEOUT';
                  reject(timeoutError);
                }, applyTimeoutMs);
              });
              await Promise.race([
                executeJob(job, { signal: ac.signal }),
                timeoutPromise,
              ]);
            } finally {
              if (timer) clearTimeout(timer);
            }
          } else {
            await executeJob(job);
          }

          await queue.markCompleted(job.id);
          console.log(`[queue-worker ${workerId}] completed ${job.id}`);
          await audit(Number(job.telegram_chat_id), 'automation_completed', {
            queueId: job.id,
            workerId,
            completedAt: new Date().toISOString(),
          }).catch(() => {});
        }"""

code = code.replace(old_exec, new_exec)

old_fail = """        if (isTimeout) {
          if (typeof queue.markFailed === 'function') {
            await queue.markFailed(job.id, 'application_timeout');
          } else {
            await queue.markFailedOrRetry(job.id, 'application_timeout', job.max_attempts || 1, job.max_attempts || 1);
          }
          const company = job.company || job.company_name || job.job_title || 'the job';
          await sendTimeoutMessage(Number(job.telegram_chat_id), company).catch((err) => {
            console.error(`[queue-worker ${workerId}] sendTimeoutMessage failed:`, err.message);
          });
          await audit(Number(job.telegram_chat_id), 'application_timeout', {
            queueId: job.id,
            workerId,
            timedOutAt: new Date().toISOString(),
            timeoutMs: applyTimeoutMs,
          }).catch(() => {});
        } else {
          const result = await queue.markFailedOrRetry(
            job.id,
            error.message,
            job.attempts,
            job.max_attempts
          );
          if (result.retried) {
            console.log(`[queue-worker ${workerId}] re-queued ${job.id} (attempt ${job.attempts}/${job.max_attempts})`);
          }
          await audit(Number(job.telegram_chat_id), 'automation_failed', {
            queueId: job.id,
            workerId,
            failedAt: new Date().toISOString(),
            error: error.message,
            retried: result.retried,
          }).catch(() => {});
        }"""

new_fail = """        if (job.status === 'preflight_running') {
          await queue.updateJobStatus(job.id, 'preflight_failed', { last_error: error.message });
          console.error(`[queue-worker ${workerId}] preflight failed for ${job.id}:`, error.message);
          await audit(Number(job.telegram_chat_id), 'preflight_failed', {
            queueId: job.id,
            workerId,
            failedAt: new Date().toISOString(),
            error: error.message,
          }).catch(() => {});
        } else {
          if (isTimeout) {
            if (typeof queue.markFailed === 'function') {
              await queue.markFailed(job.id, 'application_timeout');
            } else {
              await queue.markFailedOrRetry(job.id, 'application_timeout', job.max_attempts || 1, job.max_attempts || 1);
            }
            const company = job.company || job.company_name || job.job_title || 'the job';
            await sendTimeoutMessage(Number(job.telegram_chat_id), company).catch((err) => {
              console.error(`[queue-worker ${workerId}] sendTimeoutMessage failed:`, err.message);
            });
            await audit(Number(job.telegram_chat_id), 'application_timeout', {
              queueId: job.id,
              workerId,
              timedOutAt: new Date().toISOString(),
              timeoutMs: applyTimeoutMs,
            }).catch(() => {});
          } else {
            const result = await queue.markFailedOrRetry(
              job.id,
              error.message,
              job.attempts,
              job.max_attempts
            );
            if (result.retried) {
              console.log(`[queue-worker ${workerId}] re-queued ${job.id} (attempt ${job.attempts}/${job.max_attempts})`);
            }
            await audit(Number(job.telegram_chat_id), 'automation_failed', {
              queueId: job.id,
              workerId,
              failedAt: new Date().toISOString(),
              error: error.message,
              retried: result.retried,
            }).catch(() => {});
          }
        }"""

code = code.replace(old_fail, new_fail)

with open('lib/apply-worker.js', 'w') as f:
    f.write(code)

print("Patched apply-worker.js successfully.")
