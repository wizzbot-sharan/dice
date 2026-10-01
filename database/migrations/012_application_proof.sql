ALTER TABLE clients_additional_info
ADD COLUMN IF NOT EXISTS zoho_connection BOOLEAN DEFAULT false;

ALTER TABLE dice_applied_jobs
ADD COLUMN IF NOT EXISTS screenshot_link TEXT,
ADD COLUMN IF NOT EXISTS email_json JSONB;
