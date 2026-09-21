const { createPool } = require('./azure');

async function savePendingQuestion({ telegramChatId, questionToken, questionText, options = null, expiresAt }) {
  const pool = createPool();
  await pool.query(
    `INSERT INTO dice_pending_answers (
       telegram_chat_id, question_token, question_text, options, expires_at
     )
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (question_token) DO UPDATE SET
       question_text = EXCLUDED.question_text,
       options = EXCLUDED.options,
       expires_at = EXCLUDED.expires_at`,
    [telegramChatId, questionToken, questionText, options ? JSON.stringify(options) : null, expiresAt]
  );
}

async function findActivePendingQuestion(telegramChatId) {
  const pool = createPool();
  const result = await pool.query(
    `SELECT id, telegram_chat_id, question_token, question_text, options, answer, expires_at
     FROM dice_pending_answers
     WHERE telegram_chat_id = $1
       AND answer IS NULL
       AND expires_at > NOW()
     ORDER BY asked_at DESC
     LIMIT 1`,
    [telegramChatId]
  );
  return result.rows?.[0] || null;
}

async function recordPendingAnswer(questionToken, answer) {
  const pool = createPool();
  const result = await pool.query(
    `UPDATE dice_pending_answers
     SET answer = $2, answered_at = NOW()
     WHERE question_token = $1
       AND answer IS NULL
     RETURNING id, answer`,
    [questionToken, answer]
  );
  return result.rowCount > 0;
}

async function getAnswerForQuestion(questionToken) {
  const pool = createPool();
  const result = await pool.query(
    `SELECT answer, expires_at
     FROM dice_pending_answers
     WHERE question_token = $1`,
    [questionToken]
  );
  if (!result.rows || result.rows.length === 0) return null;
  return result.rows[0];
}

async function clearExpiredPendingQuestions() {
  const pool = createPool();
  try {
    await pool.query(
      `DELETE FROM dice_pending_answers
       WHERE expires_at < NOW() - INTERVAL '1 hour'`
    );
  } catch (error) {
    console.error('Failed to clear expired pending questions:', error.message);
  }
}

module.exports = {
  savePendingQuestion,
  findActivePendingQuestion,
  recordPendingAnswer,
  getAnswerForQuestion,
  clearExpiredPendingQuestions,
};
