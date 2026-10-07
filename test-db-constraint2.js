require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function test() {
  try {
    const res = await pool.query(`
      SELECT pg_get_constraintdef(oid) AS def
      FROM pg_constraint
      WHERE conname = 'dice_applied_jobs_status_check';
    `);
    console.log(res.rows[0]?.def || 'Constraint not found');
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
test();
