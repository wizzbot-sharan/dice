require('dotenv').config();
const { startTicker } = require('./ticker');
const { startWorkers } = require('./worker');
const { startEmailVerifier } = require('./email-verifier');

async function main() {
  console.log('[V2 Autonomous System] Booting up...');
  
  // 1. Start the queue consumers (5 Playwright workers)
  startWorkers();

  // 2. Start the Orchestrator (Tickers)
  startTicker();

  // 3. Start the Email Verifier background loop
  startEmailVerifier();
}

main().catch(err => {
  console.error('[V2 Fatal Error]', err);
  process.exit(1);
});
