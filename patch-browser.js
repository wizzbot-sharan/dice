const fs = require('fs');
let code = fs.readFileSync('lib/browser.js', 'utf8');

const idleLogic = `
let idleTimeoutTimer = null;
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

function cancelIdleTimeout() {
  if (idleTimeoutTimer) {
    clearTimeout(idleTimeoutTimer);
    idleTimeoutTimer = null;
  }
}

function startIdleTimeout() {
  cancelIdleTimeout();
  idleTimeoutTimer = setTimeout(async () => {
    if (sharedBrowser && sharedBrowser._activeContexts === 0) {
      console.log(\`[browser] Chromium has been idle for 30 minutes. Shutting down to free RAM.\`);
      await closeSharedBrowser();
    }
  }, IDLE_TIMEOUT_MS);
}
`;

// Insert idle logic near the top
code = code.replace('const RECYCLE_THRESHOLD = envInt(\'BROWSER_RECYCLE_THRESHOLD\', 40);', 'const RECYCLE_THRESHOLD = envInt(\'BROWSER_RECYCLE_THRESHOLD\', 40);\n' + idleLogic);

// Insert cancelIdleTimeout in openLocalBrowser
code = code.replace('const browser = await getSharedBrowser();', 'cancelIdleTimeout();\n    const browser = await getSharedBrowser();');

// Insert startIdleTimeout in closeBrowser
code = code.replace('if (sharedBrowser !== browser && browser._activeContexts === 0) {', 'if (sharedBrowser !== browser && browser._activeContexts === 0) {\n          console.log(`[browser] Retired Chromium instance is now empty. Closing it safely.`);\n          await browser.close().catch(() => {});\n        } else if (sharedBrowser === browser && browser._activeContexts === 0) {\n          startIdleTimeout();\n        } else if (false) {'); // Dirty hack to replace the if block

// Wait, doing the dirty hack is bad. Let's do a better replace.
code = code.replace(`        if (sharedBrowser !== browser && browser._activeContexts === 0) {
          console.log(\`[browser] Retired Chromium instance is now empty. Closing it safely.\`);
          await browser.close().catch(() => {});
        }`, `        if (sharedBrowser !== browser && browser._activeContexts === 0) {
          console.log(\`[browser] Retired Chromium instance is now empty. Closing it safely.\`);
          await browser.close().catch(() => {});
        } else if (sharedBrowser === browser && browser._activeContexts === 0) {
          startIdleTimeout();
        }`);

fs.writeFileSync('lib/browser.js', code);
