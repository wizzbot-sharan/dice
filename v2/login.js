const { openBrowser, closeBrowser } = require('../lib/browser');
const { createPool } = require('../lib/azure');

const loginUrl = 'https://www.dice.com/dashboard/login';

async function refreshLogin(applywizzId) {
  const dicePassword = process.env.DICE_PASSWORD;
  if (!dicePassword) {
    throw new Error('DICE_PASSWORD environment variable is missing.');
  }

  const pool = createPool();
  // Fetch the email for this applywizzId from dice_sessions (which holds their login email)
  const userRes = await pool.query(`
    SELECT email, client_id 
    FROM dice_sessions 
    WHERE applywizz_id = $1
    LIMIT 1
  `, [applywizzId]);

  if (userRes.rows.length === 0 || !userRes.rows[0].email) {
    throw new Error(`No email found in dice_sessions for ${applywizzId}`);
  }

  const email = userRes.rows[0].email;
  console.log(`[V2 Login Manager] Starting autonomous login for ${applywizzId} (${email})...`);
  
  const handle = await openBrowser({ headless: true });
  const { context, page } = handle;

  try {
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    
    // Check if already logged in just in case
    if (!page.url().includes('login')) {
       console.log(`[V2 Login Manager] Already logged in for ${applywizzId}`);
       const state = await context.storageState();
       return state;
    }

    await page.waitForSelector('input[type="email"]', { timeout: 30000 });
    
    // Type with delay
    await page.type('input[type="email"]', email, { delay: 50 });
    await page.waitForTimeout(1500);
    await page.click('[data-testid="sign-in-button"]');

    await page.waitForSelector('input[type="password"]', { timeout: 30000 });
    await page.type('input[type="password"]', dicePassword, { delay: 50 });
    await page.waitForTimeout(2000);
    await page.click('[data-testid="submit-password"]');
    
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => { });
    await page.waitForTimeout(5000); // Give it extra time to redirect

    if (page.url().includes('/login')) {
      throw new Error(`Login did not complete. Stuck at URL: ${page.url()}`);
    }

    // Save session state to database
    const storageState = await context.storageState();
    
    await pool.query(`
      UPDATE dice_sessions 
      SET storage_state = $1, updated_at = CURRENT_TIMESTAMP
      WHERE applywizz_id = $2
    `, [JSON.stringify(storageState), applywizzId]);

    console.log(`[V2 Login Manager] Login successful and session saved for ${applywizzId}`);
    return storageState;

  } finally {
    await closeBrowser(handle);
  }
}

module.exports = { refreshLogin };
