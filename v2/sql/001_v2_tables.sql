CREATE TABLE IF NOT EXISTS dice_apply_queue_v2 (
    id SERIAL PRIMARY KEY,
    applywizz_id VARCHAR(255) NOT NULL,
    job_id VARCHAR(255) NOT NULL,
    job_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, preflight_failed, failed, success
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

CREATE TABLE IF NOT EXISTS dice_applied_jobs_v2 (
    id SERIAL PRIMARY KEY,
    applywizz_id VARCHAR(255) NOT NULL,
    job_id VARCHAR(255) NOT NULL,
    job_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending_email', -- pending_email, verified_email, failed
    screenshot_url TEXT,
    error_message TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP WITH TIME ZONE,
    email_verification_attempts INT DEFAULT 0
);

-- Indexes for fast querying by the orchestrator
CREATE INDEX IF NOT EXISTS idx_apply_queue_v2_status ON dice_apply_queue_v2(status);
CREATE INDEX IF NOT EXISTS idx_apply_queue_v2_applywizz_id ON dice_apply_queue_v2(applywizz_id);
CREATE INDEX IF NOT EXISTS idx_applied_jobs_v2_applywizz_id ON dice_applied_jobs_v2(applywizz_id);
CREATE INDEX IF NOT EXISTS idx_applied_jobs_v2_status ON dice_applied_jobs_v2(status);
