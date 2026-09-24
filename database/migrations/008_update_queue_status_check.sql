ALTER TABLE dice_apply_queue DROP CONSTRAINT IF EXISTS dice_apply_queue_status_check;
ALTER TABLE dice_apply_queue ADD CONSTRAINT dice_apply_queue_status_check CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled', 'preflight_queued', 'preflight_running', 'preflight_passed','preflight_failed', 'prompt_sent'));
