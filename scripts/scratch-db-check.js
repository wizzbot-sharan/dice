require('dotenv').config();
const { createPool } = require('../lib/azure.js');

async function run() {
  const pool = createPool();
  try {
    const res = await pool.query(`
      SELECT * FROM dice_ca_accounts
      WHERE id IN ('630e60b8-4695-4e08-b56d-144c96017f9e', 'e33284fc-6ef3-47fb-9047-80cfddd2ff75', 'b91c88d5-e0c5-4f8c-a4a1-0c1057a1f1e0')
    `);
    console.log("Check for old CA ID:");
    console.table(res.rows);

  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
