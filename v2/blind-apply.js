const { openBrowser, closeBrowser } = require('../lib/browser');
const { createPool } = require('../lib/azure');
const { uploadScreenshot } = require('../lib/s3-screenshot');
const { refreshLogin } = require('./login');

const waitRandom = (min, max) => new Promise(r => setTimeout(r, Math.floor(Math.random() * (max - min + 1) + min) * 1000));

async function getStorageState(applywizzId) {
  const pool = createPool();
  const res = await pool.query(
    'SELECT storage_state FROM dice_sessions WHERE applywizz_id = $1 ORDER BY updated_at DESC LIMIT 1',
    [applywizzId]
  );
  if (res.rows.length > 0 && res.rows[0].storage_state) {
    try {
      return typeof res.rows[0].storage_state === 'string'
        ? JSON.parse(res.rows[0].storage_state)
        : res.rows[0].storage_state;
    } catch (e) {
      console.warn(`[V2 Blind Apply] Failed to parse storage_state for ${applywizzId}`);
    }
  }
  return undefined;
}

async function blindApply(applywizzId, jobUrl, jobId, retryAfterLogin = false) {
  let handle = null;
  let screenshotUrl = null;
  let screenshotError = null;

  try {
    let storageState = await getStorageState(applywizzId);
    
    // Auto-login if no storage state exists at all
    if (!storageState && !retryAfterLogin) {
      console.log(`[V2 Blind Apply] No storage state found for ${applywizzId}. Attempting auto-login...`);
      storageState = await refreshLogin(applywizzId);
    }
    
    if (!storageState) {
      return { success: false, errorType: 'apply_failed', error: `Could not retrieve or create session for ${applywizzId}` };
    }

    handle = await openBrowser({ storageState, headless: true });
    let { page } = handle;

    console.log(`[V2 Blind Apply] [${applywizzId}] Navigating to ${jobUrl}`);
    await page.goto(jobUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('load', { timeout: 30000 }).catch(() => {});
    
    // 1. Initial Page Load Wait (10-15s)
    console.log(`[V2 Blind Apply] [${applywizzId}] Waiting 10-15 seconds for page load...`);
    await waitRandom(10, 15);

    // Check if Dice redirected us to the login page (Session Expired)
    if (page.url().includes('/login') && !retryAfterLogin) {
       console.log(`[V2 Blind Apply] [${applywizzId}] Session expired! Redirected to login. Running auto-login...`);
       await closeBrowser(handle);
       handle = null; // Prevent double close in finally
       
       await refreshLogin(applywizzId);
       // Recursively retry once after a successful login
       return await blindApply(applywizzId, jobUrl, jobId, true);
    }

    // 1. Initial Apply - PREFLIGHT CHECK
    const applyButton = page.locator('button:has-text("Apply now"), button[aria-label="Apply to this job"]');
    if (await applyButton.isVisible()) {
      await applyButton.click();
      
      // 2. Wait after clicking apply (10-15s)
      console.log(`[V2 Blind Apply] [${applywizzId}] Clicked Apply, waiting 10-15 seconds...`);
      await waitRandom(10, 15);
    } else {
      // PREFLIGHT FAILED
      return { success: false, errorType: 'preflight_failed', error: 'Apply button not found or not visible (already applied, expired, or third-party)' };
    }

    // 2. Loop "Next" until "Submit" - APPLY FLOW (failures here are 'apply_failed')
    let loopCount = 0;
    while (loopCount < 10) { // Safety limit to avoid infinite loop
      loopCount++;

      const submitButton = page.locator('button:has-text("Submit"), button[aria-label="Submit"]');
      if (await submitButton.isVisible() && await submitButton.isEnabled()) {
        console.log(`[V2 Blind Apply] [${applywizzId}] Submit button found. Clicking Submit!`);
        await submitButton.click();
        
        // 3. Wait after submit (5s as requested)
        console.log(`[V2 Blind Apply] [${applywizzId}] Submitted, waiting 5 seconds for success screen...`);
        await page.waitForTimeout(5000);
        
        // Take screenshot
        try {
          const buffer = await page.screenshot({ fullPage: true });
          const key = `dice-success/${applywizzId}-${jobId}-${Date.now()}.png`;
          screenshotUrl = await uploadScreenshot(buffer, key);
        } catch (err) {
           screenshotError = 'Screenshot failed: ' + err.message;
        }
        
        break; // Success!
      }

      const nextButton = page.locator('button:has-text("Next"), button[aria-label="Next"]');
      if (await nextButton.isVisible()) {
        if (await nextButton.isEnabled()) {
          console.log(`[V2 Blind Apply] [${applywizzId}] Clicking Next...`);
          await nextButton.click();
          
          // 4. Wait after clicking Next (10-15s)
          console.log(`[V2 Blind Apply] [${applywizzId}] Clicked Next, waiting 10-15 seconds...`);
          await waitRandom(10, 15);
        } else {
          return { success: false, errorType: 'apply_failed', error: 'Next button is disabled (Mandatory fields likely blocked it)' };
        }
      } else {
        return { success: false, errorType: 'apply_failed', error: 'Neither Next nor Submit button found in modal' };
      }
    }

    if (loopCount >= 10 && !screenshotUrl && !screenshotError) {
      return { success: false, errorType: 'apply_failed', error: 'Exceeded maximum number of Next clicks (10)' };
    }

    return { success: true, screenshotUrl, screenshotError };

  } catch (err) {
    console.error(`[V2 Blind Apply] [${applywizzId}] Failed:`, err.message);
    return { success: false, errorType: 'apply_failed', error: err.message };
  } finally {
    if (handle) {
      await closeBrowser(handle);
    }
  }
}

module.exports = { blindApply };
