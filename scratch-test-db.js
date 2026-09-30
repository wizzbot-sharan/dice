require('dotenv').config();
const { createPool } = require('./lib/azure');

async function test() {
  const pool = createPool();
  try {
    const res = await pool.query(
        `SELECT c.full_name, c.applywizz_id, c.id as client_id
         FROM dice_telegram_connection s
         JOIN clients_additional_info c ON c.id = s.client_id
         WHERE s.telegram_chat_id = $1::text
         LIMIT 1`,
        ['8837632466']
      );
      console.log(res.rows);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
test();
