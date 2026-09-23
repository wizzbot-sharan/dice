const test = require('node:test');
const assert = require('node:assert/strict');
const { maxConcurrent, acquireBrowserTicket, releaseBrowserTicket } = require('../lib/browser');

test('fourth browser ticket waits until a slot is released', async () => {
  const holdMs = 50;
  const tickets = [];
  for (let i = 0; i < maxConcurrent; i += 1) {
    tickets.push(acquireBrowserTicket());
  }
  await Promise.all(tickets);

  let fourthStarted = false;
  const fourth = acquireBrowserTicket().then(() => {
    fourthStarted = true;
  });

  await new Promise((r) => setTimeout(r, holdMs));
  assert.equal(fourthStarted, false);

  releaseBrowserTicket();
  await fourth;
  assert.equal(fourthStarted, true);

  for (let i = 0; i < maxConcurrent; i += 1) {
    releaseBrowserTicket();
  }
});
