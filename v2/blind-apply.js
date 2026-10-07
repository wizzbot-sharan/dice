const { openBrowser, closeBrowser } = require('../lib/browser');
const { createPool } = require('../lib/azure');
const { uploadScreenshot } = require('../lib/s3-screenshot');

async function getStorageState(applywizzId) {
  const pool = createPool();
  const res = await pool.query(
    'SELECT storage_state FROM dice_workflow_sessions WHERE applywizz_id = $1 ORDER BY updated_at DESC LIMIT 1',
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

async function blindApply(applywizzId, jobUrl, jobId) {
  let handle = null;
  let screenshotUrl = null;

  try {
    const storageState = await getStorageState(applywizzId);
    if (!storageState) {
      return { success: false, errorType: 'failed', error: `No valid session storage state found for ${applywizzId}` };
    }

    handle = await openBrowser({ storageState, headless: true });
    const { page } = handle;

    console.log(`[V2 Blind Apply] [${applywizzId}] Navigating to ${jobUrl}`);
    await page.goto(jobUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('load', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000); // Let UI settle

    // 1. Initial Apply - PREFLIGHT CHECK
    const applyButton = page.locator('button:has-text("Apply now"), button[aria-label="Apply to this job"]');
    if (await applyButton.isVisible()) {
      await applyButton.click();
      await page.waitForTimeout(3000);
    } else {
      // PREFLIGHT FAILED
      return { success: false, errorType: 'preflight_failed', error: 'Apply button not found or not visible (already applied, expired, or third-party)' };
    }

    // 2. Loop "Next" until "Submit" - APPLY FLOW (failures here are 'failed')
    let loopCount = 0;
    while (loopCount < 10) { // Safety limit to avoid infinite loop
      loopCount++;
      await page.waitForTimeout(2000);

      const submitButton = page.locator('button:has-text("Submit"), button[aria-label="Submit"]');
      if (await submitButton.isVisible() && await submitButton.isEnabled()) {
        console.log(`[V2 Blind Apply] [${applywizzId}] Submit button found. Clicking Submit!`);
        await submitButton.click();
        await page.waitForTimeout(5000);
        
        // Take screenshot
        try {
          const buffer = await page.screenshot({ fullPage: true });
          const key = `dice-success/${applywizzId}-${jobId}-${Date.now()}.png`;
          screenshotUrl = await uploadScreenshot(buffer, key);
        } catch (screenshotError) {
           return { success: false, errorType: 'failed', error: 'Submission successful but failed to capture/upload screenshot: ' + screenshotError.message };
        }
        
        break; // Success!
      }

      const nextButton = page.locator('button:has-text("Next"), button[aria-label="Next"]');
      if (await nextButton.isVisible()) {
        if (await nextButton.isEnabled()) {
          console.log(`[V2 Blind Apply] [${applywizzId}] Clicking Next...`);
          await nextButton.click();
          await page.waitForTimeout(2000);
        } else {
          return { success: false, errorType: 'failed', error: 'Next button is disabled (Mandatory fields likely blocked it)' };
        }
      } else {
        return { success: false, errorType: 'failed', error: 'Neither Next nor Submit button found in modal' };
      }
    }

    if (loopCount >= 10 && !screenshotUrl) {
      return { success: false, errorType: 'failed', error: 'Exceeded maximum number of Next clicks (10)' };
    }

    return { success: true, screenshotUrl };

  } catch (err) {
    console.error(`[V2 Blind Apply] [${applywizzId}] Failed:`, err.message);
    return { success: false, errorType: 'failed', error: err.message };
  } finally {
    if (handle) {
      await closeBrowser(handle);
    }
  }
}

module.exports = { blindApply };
