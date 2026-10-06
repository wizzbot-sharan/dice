require('dotenv').config();
const { createServiceClient } = require('./lib/azure');

async function run() {
  const azure = createServiceClient();
  try {
    const q = [{ text: 'Test?', type: 'text', options: [] }];
    // Find an arbitrary queue row (we won't change its state, just the new column)
    const { data: queueRow } = await azure.from('dice_apply_queue').select('*').limit(1);
    if (!queueRow || queueRow.length === 0) { console.log('No rows to test on'); return; }
    
    console.log('Testing JSONB update on id:', queueRow[0].id);
    const { error } = await azure.from('dice_apply_queue').update({
      preflight_questions: q // directly passing array
    }).eq('id', queueRow[0].id);
    
    if (error) {
      console.error('Update failed directly:', error.message);
      const { error: err2 } = await azure.from('dice_apply_queue').update({
        preflight_questions: JSON.stringify(q) // passing stringified
      }).eq('id', queueRow[0].id);
      if (err2) {
        console.error('Update failed stringified:', err2.message);
      } else {
        console.log('Update succeeded ONLY when stringified!');
      }
    } else {
      console.log('Update succeeded directly with array!');
    }
  } catch (err) {
    console.error(err);
  }
}
run();
