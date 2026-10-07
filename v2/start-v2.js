const { startTicker } = require('./ticker');
const { startWorkers } = require('./worker');

async function bootV2() {
  console.log('[V2 Autonomous System] Booting up...');
  
  // Start the 5 browser workers to consume the queue
  startWorkers();

  // Start the orchestrator ticker to trickle jobs into the queue
  startTicker();
}

bootV2().catch(err => {
  console.error('[V2 Autonomous System] Fatal crash:', err);
});
