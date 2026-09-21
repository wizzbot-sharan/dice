CREATE TABLE IF NOT EXISTS dice_pending_answers (
  id               BIGSERIAL PRIMARY KEY,
  telegram_chat_id BIGINT NOT NULL,
  question_token   TEXT NOT NULL UNIQUE,
  question_text    TEXT NOT NULL,
  options          JSONB,
  answer           TEXT DEFAULT NULL,
  asked_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  answered_at      TIMESTAMPTZ DEFAULT NULL,
  expires_at       TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pending_answers_chat_token
  ON dice_pending_answers (telegram_chat_id, question_token);
