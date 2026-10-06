require('dotenv').config();
const { createServiceClient } = require('./lib/azure');

async function run() {
  const azure = createServiceClient();
  try {
    const { error } = await azure.from('dice_apply_queue').update({
      non_existent_column: 'test'
    }).eq('id', '12345678-1234-1234-1234-123456789012');
    console.log('Did not throw! Error:', error?.message);
  } catch (err) {
    console.log('It threw! Error:', err.message);
  }
}
run();
