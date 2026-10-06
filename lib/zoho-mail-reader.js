const fs = require('fs');
const path = require('path');
const { openBrowser, closeBrowser } = require('./browser');

const ZOHO_SESSION_PATH = path.join(__dirname, '..', 'data', 'zoho-session.json');

async function getZohoSessionState() {
  if (fs.existsSync(ZOHO_SESSION_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(ZOHO_SESSION_PATH, 'utf8'));
    } catch (err) {
      console.warn('Failed to parse zoho-session.json', err);
    }
  }
  return undefined;
}

async function saveZohoSessionState(storageState) {
  const dataDir = path.dirname(ZOHO_SESSION_PATH);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(ZOHO_SESSION_PATH, JSON.stringify(storageState));
}

async function loginToZohoAdmin(page, adminLoginBtn) {
  if (adminLoginBtn) {
    console.log('[zoho] Found Admin Login button, clicking...');
    await adminLoginBtn.click();
  } else {
    const fallbackBtn = page.locator('button', { hasText: /Admin login/i }).first();
    if (await fallbackBtn.isVisible().catch(() => false)) {
       await fallbackBtn.click();
    } else {
       console.log('[zoho] Admin Login button not visible, cannot login.');
       return;
    }
  }

  await page.waitForTimeout(5000); // Wait for login form

  console.log('[zoho] Filling admin credentials...');
  await page.fill('input[type="text"], input[name="username"]', process.env.ZOHO_ADMIN_USERNAME);
  await page.fill('input[type="password"], input[name="password"]', process.env.ZOHO_ADMIN_PASSWORD);
  
  const submitBtn = page.locator('button', { hasText: /^(Login|Submit|Continue)$/i });
  if (await submitBtn.count() > 0) {
    await submitBtn.first().click();
  } else {
    await page.keyboard.press('Enter');
  }

  console.log('[zoho] Waiting up to 30 seconds for dashboard (Log out button) to load...');
  
  const logoutBtn = page.locator('button', { hasText: /Log out/i }).first();
  await logoutBtn.waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
  
  // Explicit 30 second wait just to guarantee the email list populates before the next steps
  await page.waitForTimeout(30000);

  const stillVisible = await page.locator('button', { hasText: /Admin login/i }).first().isVisible().catch(() => false);
  const loggedIn = await logoutBtn.isVisible().catch(() => false);
  
  if (stillVisible && !loggedIn) {
    throw new Error('Failed to login to Zoho Mail Reader admin');
  }

  const storageState = await page.context().storageState();
  await saveZohoSessionState(storageState);
}

async function setupZohoPage(handle) {
  if (!process.env.ZOHO_MAIL_READER_URL || !process.env.ZOHO_ADMIN_USERNAME) {
    return { error: 'reader not configured' };
  }

  const page = await handle.context.newPage();
  
  try {
    await page.goto(process.env.ZOHO_MAIL_READER_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Explicit 10-second wait just to let the page settle (as requested)
    console.log('[zoho] Waiting 10 seconds for initial load buffer...');
    await page.waitForTimeout(10000);
    
    // Wait for EITHER the "Log out" button OR the "Admin login" button to appear
    const logoutBtn = page.locator('button', { hasText: /Log out/i }).first();
    const adminLoginBtn = page.locator('button', { hasText: /Admin login/i }).first();
    
    await Promise.race([
      logoutBtn.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {}),
      adminLoginBtn.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
    ]);

    const isLoggedIn = await logoutBtn.isVisible().catch(() => false);
    const needsLogin = await adminLoginBtn.isVisible().catch(() => false);

    if (isLoggedIn) {
      console.log('[zoho] Session active (Log out button visible). Waiting 30 seconds after load...');
      await page.waitForTimeout(30000);
    } else if (needsLogin) {
      console.log('[zoho] Session expired (Admin login button visible), performing login...');
      await loginToZohoAdmin(page, adminLoginBtn);
    } else {
      console.log('[zoho] Neither Log out nor Admin login is visible, waiting 10 more seconds and retrying login check...');
      await page.waitForTimeout(10000);
      const stillNeedsLogin = await adminLoginBtn.isVisible().catch(() => false);
      if (stillNeedsLogin) {
         await loginToZohoAdmin(page, adminLoginBtn);
      }
    }

    return { page };
  } catch (err) {
    if (page && !page.isClosed()) await page.close().catch(()=> { });
    throw err;
  }
}

async function verifyJobApplicationEmail(companyEmail, companyName, jobTitle, abortSignal) {
  const storageState = await getZohoSessionState();
  let handle = await openBrowser({ storageState, headless: true });
  
  try {
    const { page, error } = await setupZohoPage(handle);
    if (error) return { status: error };

    console.log(`[zoho] Searching for client: ${companyEmail}`);
    const searchBox = page.locator('input[placeholder*="email"]').first();
    await searchBox.fill(companyEmail);
    await page.waitForTimeout(10000);

    const clientItem = page.locator(`text=${companyEmail}`).first();
    if (await clientItem.count() > 0) {
       await clientItem.click();
    }

    const readMailsBtn = page.locator('button', { hasText: 'Read mails' });
    if (await readMailsBtn.count() === 0) {
      return { status: 'mail not received', reason: 'read mails button not found' };
    }

    let attempts = 0;
    while (attempts < 10) {
      if (abortSignal?.aborted) {
        console.log('[zoho] Aborted due to apply timeout.');
        return { status: 'mail not received', reason: 'aborted' };
      }

      console.log(`[zoho] Clicking Read mails (attempt ${attempts + 1}/10)`);
      await readMailsBtn.first().click();
      await page.waitForTimeout(10000); // wait 10s for list

      // Parse emails list by finding elements that contain the sender
      const possibleCards = await page.locator('div, li').filter({ hasText: 'applyonline@dice.com' }).all();
      
      let foundMail = null;
      for (const card of possibleCards) {
         const text = await card.innerText().catch(() => '');
         
         // Skip large page containers, we only want the specific email card (usually < 500 chars)
         if (!text || text.length > 500) continue;

         const cleanText = text.toLowerCase();
         const matchCompany = cleanText.includes(companyName.toLowerCase());
         const matchTitle = cleanText.includes(jobTitle.toLowerCase());
         
         if (matchCompany || matchTitle) {
            console.log(`[zoho] Found matching email card! Clicking it...`);
            await card.click(); 
            
            console.log(`[zoho] Waiting 25 seconds for the email body to load completely...`);
            await page.waitForTimeout(25000); // Wait 25s for body to load
            
            // Extract fields
            foundMail = {
              to: companyEmail,
              from: 'applyonline@dice.com',
              subject: `Application to ${companyName} for ${jobTitle}`,
              body_text: await page.locator('.message-body, .email-content, iframe').innerText().catch(() => text),
              body_html: await page.locator('.message-body, .email-content, iframe').innerHTML().catch(() => text),
              received_at: new Date().toISOString()
            };
            break;
         }
      }

      if (foundMail) {
        console.log(`[zoho] Found matching mail for ${companyName}!`);
        return foundMail;
      }

      attempts++;
      if (attempts < 10) {
        console.log(`[zoho] Mail not found. Waiting 1 minute...`);
        for(let i=0; i<60; i+=5) {
          if (abortSignal?.aborted) return { status: 'mail not received', reason: 'aborted' };
          await page.waitForTimeout(5000);
        }
      }
    }

    return { status: 'mail not received' };
  } finally {
    await closeBrowser(handle);
  }
}

async function syncConnectedClients(dbPool) {
  console.log('[zoho] Starting global sync of connected clients...');
  const storageState = await getZohoSessionState();
  let handle = await openBrowser({ storageState, headless: true });
  
  try {
    const { page, error } = await setupZohoPage(handle);
    if (error) {
      console.log(`[zoho] Skipping sync: ${error}`);
      return;
    }

    console.log('[zoho] Clicking Connected filter...');
    const connectedTab = page.locator('button[data-filter="connected"]');
    if (await connectedTab.count() > 0) {
      await connectedTab.first().click();
    } else {
      // Fallback in case the attribute is missing
      const fallbackTab = page.locator('button', { hasText: 'Connected' });
      if (await fallbackTab.count() > 0) await fallbackTab.first().click();
    }
    await page.waitForTimeout(10000);

    // Scrape all emails in the list
    const emailLocators = await page.locator('.user-item .email').all();
    const emailsFound = new Set();
    
    for (const loc of emailLocators) {
      const text = await loc.innerText();
      // basic extraction of emails
      const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (match) {
        emailsFound.add(match[0].toLowerCase());
      }
    }

    console.log(`[zoho] Found ${emailsFound.size} connected emails.`);
    
    // Reset all to false
    await dbPool.query(`UPDATE clients_additional_info SET zoho_connection = false`);
    
    // Set true for found
    if (emailsFound.size > 0) {
      const emailArray = Array.from(emailsFound);
      const values = emailArray.map((_, i) => `$${i + 1}`).join(',');
      await dbPool.query(`
        UPDATE clients_additional_info 
        SET zoho_connection = true 
        WHERE lower(company_email) IN (${values})
      `, emailArray);
      console.log(`[zoho] Updated database with ${emailsFound.size} connected users.`);
    }
  } catch (err) {
    console.error('[zoho] Error during global sync:', err.message);
  } finally {
    await closeBrowser(handle);
  }
}

module.exports = {
  verifyJobApplicationEmail,
  syncConnectedClients
};
