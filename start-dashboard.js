require('dotenv').config();

const { createPool } = require('./lib/azure');
const { createDashboardServer } = require('./lib/dashboard-server');

const pool = createPool();
const dashboardServer = createDashboardServer({ db: pool });
const dashboardPort = Number(process.env.PORT || 3000);

const server = dashboardServer.listen(dashboardPort, '0.0.0.0', () => {
  console.log(`[dice_autoapply_dashboard] listening on port ${dashboardPort} at /dashboard`);
});

async function shutdown() {
  console.log('[dice_autoapply_dashboard] Shutting down...');
  await new Promise((resolve) => server.close(resolve));
  await pool.end().catch(() => {});
  process.exit(0);
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
