require('dotenv').config();
const { createPool } = require('./lib/azure');

async function run() {
  const pool = createPool();
  try {
    console.log('Adding columns...');
    await pool.query(`
      ALTER TABLE dice_apply_queue
        ADD COLUMN IF NOT EXISTS step_count INTEGER DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS preflight_questions JSONB DEFAULT NULL;
    `);
    await pool.query(`
      ALTER TABLE dice_workflow_sessions
        ADD COLUMN IF NOT EXISTS pending_preflight_questions TEXT DEFAULT NULL;
    `);
    console.log('Done!');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
run();
