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
    
    console.log(`[V2 Blind Apply] [${applywizzId}] Waiting 10-15 seconds for page load...`);
    await waitRandom(10, 15);

    console.log(`[V2 Blind Apply] [${applywizzId}] Page loaded. Current URL is: ${page.url()}`);

    if (page.url().includes('/login') && !retryAfterLogin) {
       console.log(`[V2 Blind Apply] [${applywizzId}] Session expired! Redirected to login. Running auto-login...`);
       await closeBrowser(handle);
       handle = null;
       await refreshLogin(applywizzId);
       return await blindApply(applywizzId, jobUrl, jobId, true);
    }

    // 1. Initial Apply - PREFLIGHT CHECK
    const applyButton = page.locator('button:has-text("Apply now"), button[aria-label="Apply to this job"]');
    
    if (await applyButton.isVisible()) {
      console.log(`[V2 Blind Apply] [${applywizzId}] Found Apply button! Clicking it...`);
      await applyButton.click();
      
      console.log(`[V2 Blind Apply] [${applywizzId}] Clicked Apply, waiting 10-15 seconds...`);
      await waitRandom(10, 15);
    } else {
      console.log(`[V2 Blind Apply] [${applywizzId}] Apply button not visible! Taking debug screenshot...`);
      let debugUrl = 'Screenshot failed';
      try {
        const buffer = await page.screenshot({ fullPage: true });
        debugUrl = await uploadScreenshot(buffer, `dice-error/preflight-${applywizzId}-${jobId}-${Date.now()}.png`);
        console.log(`[V2 Blind Apply] [DEBUG URL]: ${debugUrl}`);
      } catch (e) {
        console.error(`[V2 Blind Apply] Debug screenshot failed:`, e.message);
      }
      return { success: false, errorType: 'preflight_failed', error: `Apply button not found or not visible. Debug image: ${debugUrl}` };
    }

    // 2. Loop "Next" until "Submit" - APPLY FLOW
    let loopCount = 0;
    while (loopCount < 10) { 
      loopCount++;

      const submitButton = page.locator('button:has-text("Submit"), button[aria-label="Submit"]');
      if (await submitButton.isVisible() && await submitButton.isEnabled()) {
        console.log(`[V2 Blind Apply] [${applywizzId}] Submit button found. Clicking Submit!`);
        await submitButton.click();
        
        console.log(`[V2 Blind Apply] [${applywizzId}] Submitted, waiting 5 seconds for success screen...`);
        await page.waitForTimeout(5000);
        
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
