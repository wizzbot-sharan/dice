-- Run on Azure PostgreSQL before deploying webhook bot.
-- Conversation FSM + webhook idempotency + prompt queue linkage.

ALTER TABLE dice_workflow_sessions
  ADD COLUMN IF NOT EXISTS conversation_step text,
  ADD COLUMN IF NOT EXISTS conversation_email text,
  ADD COLUMN IF NOT EXISTS last_telegram_update_id bigint,
  ADD COLUMN IF NOT EXISTS completion_notified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS current_prompt_queue_id uuid;
