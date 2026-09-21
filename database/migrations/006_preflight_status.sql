ALTER TABLE dice_scraped_jobs
  ADD COLUMN IF NOT EXISTS preflight_status TEXT DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_scraped_jobs_preflight
  ON dice_scraped_jobs (preflight_status, scraped_at DESC);
