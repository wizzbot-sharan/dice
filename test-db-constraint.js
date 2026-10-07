const { dbPool } = require('./lib/azure');

async function test() {
  try {
    const res = await dbPool.query(`
      SELECT pg_get_constraintdef(oid) AS def
      FROM pg_constraint
      WHERE conname = 'dice_applied_jobs_status_check';
    `);
    console.log(res.rows[0]?.def || 'Constraint not found');
  } catch (e) {
    console.error(e);
  } finally {
    dbPool.end();
  }
}
test();
