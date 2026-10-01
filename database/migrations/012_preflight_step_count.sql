-- Adds step_count and preflight_questions to dice_apply_queue
-- and pending_preflight_questions to dice_workflow_sessions.

ALTER TABLE dice_apply_queue
  ADD COLUMN IF NOT EXISTS step_count          INTEGER DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS preflight_questions JSONB   DEFAULT NULL;

ALTER TABLE dice_workflow_sessions
  ADD COLUMN IF NOT EXISTS pending_preflight_questions TEXT DEFAULT NULL;
