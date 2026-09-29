require('dotenv').config();
const { createPool } = require('./lib/azure');
const pool = createPool();

async function check() {
  const clientId = '34700b47-abb1-494a-9697-7bdea4994ae2';
  const chatId = '8902972040';

  console.log('--- ALL SESSIONS FOR THESE ---');
  const session = await pool.query('SELECT telegram_chat_id, client_id, email, applywizz_id FROM dice_sessions WHERE client_id = $1 OR telegram_chat_id = $2', [clientId, chatId]);
  console.log(session.rows);

  console.log('\n--- CLIENT INFO ---');
  const client = await pool.query('SELECT id, applywizz_id, company_email, full_name FROM clients_additional_info WHERE id = $1', [clientId]);
  console.log(client.rows);

  await pool.end();
}
check().catch(console.error);
