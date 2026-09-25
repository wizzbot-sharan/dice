-- Drop and recreate the CHECK constraint for dice_apply_queue
ALTER TABLE dice_apply_queue DROP CONSTRAINT IF EXISTS dice_apply_queue_status_check;
ALTER TABLE dice_apply_queue ADD CONSTRAINT dice_apply_queue_status_check CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled', 'preflight_queued', 'preflight_running', 'preflight_passed', 'preflight_failed', 'apply_failed', 'prompt_sent'));

-- Drop and recreate the CHECK constraint for dice_applied_jobs (if it exists with a known name or just add a generic check)
-- Usually it's named dice_applied_jobs_status_check
ALTER TABLE dice_applied_jobs DROP CONSTRAINT IF EXISTS dice_applied_jobs_status_check;
ALTER TABLE dice_applied_jobs ADD CONSTRAINT dice_applied_jobs_status_check CHECK (status IN ('completed', 'failed', 'external_or_failed', 'preflight_failed', 'apply_failed'));

-- Migrate existing data based on keywords in the reason/error
-- For dice_apply_queue
UPDATE dice_apply_queue
SET status = 'preflight_failed'
WHERE status = 'failed' 
  AND (
    last_error ILIKE '%preflight%' OR last_error = 'no_apply_button' OR
    last_error ILIKE '%login%' OR
    last_error ILIKE '%auth%' OR
    last_error ILIKE '%timeout waiting for selector%' OR
    last_error ILIKE '%browser%'
  );

UPDATE dice_apply_queue
SET status = 'apply_failed'
WHERE status = 'failed';

-- For dice_applied_jobs
UPDATE dice_applied_jobs
SET status = 'preflight_failed'
WHERE status = 'failed' 
  AND (
    reason ILIKE '%preflight%' OR reason = 'no_apply_button' OR
    reason ILIKE '%login%' OR
    reason ILIKE '%auth%' OR
    reason ILIKE '%timeout waiting for selector%' OR
    reason ILIKE '%browser%'
  );

UPDATE dice_applied_jobs
SET status = 'apply_failed'
WHERE status = 'failed';
