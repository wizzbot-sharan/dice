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
let activeLocalContexts = 0;
let totalJobsProcessed = 0;
const RECYCLE_THRESHOLD = envInt('BROWSER_RECYCLE_THRESHOLD', 150);

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
        sharedBrowser = null;
        sharedBrowserPromise = null;
      });
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
    activeLocalContexts += 1;
    totalJobsProcessed += 1;
    const context = await browser.newContext(storageState ? { storageState } : undefined);
    const page = await context.newPage();
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
      if (handle.isShared) {
        activeLocalContexts = Math.max(0, activeLocalContexts - 1);
        if (totalJobsProcessed >= RECYCLE_THRESHOLD && activeLocalContexts === 0 && sharedBrowser) {
          console.log(`[browser] Recycling shared Chromium after ${totalJobsProcessed} jobs...`);
          const browserToClose = sharedBrowser;
          sharedBrowser = null;
          totalJobsProcessed = 0;
          await browserToClose.close().catch(() => {});
        }
      } else if (handle.browser) {
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
    activeLocalContexts = 0;
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
