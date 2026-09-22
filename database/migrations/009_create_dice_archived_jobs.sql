-- Migration 009: Create dice_archived_jobs table for stale scraped jobs storage
CREATE TABLE IF NOT EXISTS dice_archived_jobs (
  id UUID,
  url TEXT,
  title TEXT,
  company TEXT,
  applywizz_id TEXT,
  company_email TEXT,
  scraped_at TIMESTAMPTZ,
  preflight_status TEXT,
  archived_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT dice_archived_jobs_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_archived_jobs_scraped_at ON dice_archived_jobs (scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_archived_jobs_applywizz_id ON dice_archived_jobs (applywizz_id);

-- Alias view in case referenced with typo spelling
CREATE OR REPLACE VIEW dice_archieved_jobs AS SELECT * FROM dice_archived_jobs;
