const { chromium: localChromium } = require('playwright');

function envInt(name, defaultValue) {
  const raw = process.env[name];
  if (raw == null || raw === '') return defaultValue;
  const value = Number(String(raw).split('#')[0].trim());
  return Number.isFinite(value) && value > 0 ? value : defaultValue;
}

const maxConcurrent = envInt('LOCAL_MAX_CONCURRENT', 5);
const useBrowserbase = false;

let sharedBrowser = null;
let sharedBrowserPromise = null;
const RECYCLE_THRESHOLD = envInt('BROWSER_RECYCLE_THRESHOLD', 40);

let ticketSlotsInUse = 0;
const ticketWaiters = [];

function acquireBrowserTicket() {
  if (ticketSlotsInUse < maxConcurrent) {
    ticketSlotsInUse += 1;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    ticketWaiters.push(resolve);
  });
}

function releaseBrowserTicket() {
  ticketSlotsInUse = Math.max(0, ticketSlotsInUse - 1);
  const next = ticketWaiters.shift();
  if (next) {
    ticketSlotsInUse += 1;
    next();
  }
}

async function getSharedBrowser() {
  if (sharedBrowser && sharedBrowser.isConnected()) {
    return sharedBrowser;
  }
  if (sharedBrowserPromise) {
    return sharedBrowserPromise;
  }

  sharedBrowserPromise = (async () => {
    try {
      console.log('[browser] Launching shared Chromium instance...');
      const browser = await localChromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--no-zygote',
        ],
      });
      browser.on('disconnected', () => {
        console.log('[browser] Shared Chromium disconnected. Resetting instance.');
        if (sharedBrowser === browser) {
          sharedBrowser = null;
          sharedBrowserPromise = null;
        }
      });
      browser._activeContexts = 0;
      browser._totalJobs = 0;
      sharedBrowser = browser;
      return browser;
    } finally {
      sharedBrowserPromise = null;
    }
  })();

  return sharedBrowserPromise;
}

async function openLocalBrowser({ storageState = null, headless = true } = {}) {
  await acquireBrowserTicket();
  try {
    const browser = await getSharedBrowser();
    browser._activeContexts = (browser._activeContexts || 0) + 1;
    browser._totalJobs = (browser._totalJobs || 0) + 1;

    const context = await browser.newContext(storageState ? { storageState } : undefined);
    const page = await context.newPage();

    if (browser._totalJobs >= RECYCLE_THRESHOLD && sharedBrowser === browser) {
      console.log(`[browser] Threshold reached (${browser._totalJobs} jobs). Retiring Chromium instance gracefully.`);
      sharedBrowser = null;
      sharedBrowserPromise = null;
    }

    return {
      browser,
      context,
      page,
      sessionId: null,
      provider: 'local',
      isShared: true,
      _ticketHeld: true,
    };
  } catch (error) {
    releaseBrowserTicket();
    throw error;
  }
}

async function openBrowser(options = {}) {
  return openLocalBrowser(options);
}

async function closeBrowser(handle) {
  if (!handle) return;
  const heldTicket = handle._ticketHeld;
  try {
    if (handle.page) await handle.page.close().catch(() => {});
  } finally {
    try {
      if (handle.context) await handle.context.close().catch(() => {});
    } finally {
      if (handle.isShared && handle.browser) {
        const browser = handle.browser;
        browser._activeContexts = Math.max(0, (browser._activeContexts || 0) - 1);
        
        if (sharedBrowser !== browser && browser._activeContexts === 0) {
          console.log(`[browser] Retired Chromium instance is now empty. Closing it safely.`);
          await browser.close().catch(() => {});
        }
      } else if (handle.browser && !handle.isShared) {
        await handle.browser.close().catch(() => {});
      }
      if (heldTicket) {
        releaseBrowserTicket();
      }
    }
  }
}

async function closeSharedBrowser() {
  if (sharedBrowser) {
    console.log('[browser] Closing shared Chromium instance...');
    const browser = sharedBrowser;
    sharedBrowser = null;
    sharedBrowserPromise = null;
    await browser.close().catch(() => {});
  }
}

module.exports = {
  openBrowser,
  closeBrowser,
  closeSharedBrowser,
  getSharedBrowser,
  useBrowserbase,
  maxConcurrent,
  acquireBrowserTicket,
  releaseBrowserTicket,
};
