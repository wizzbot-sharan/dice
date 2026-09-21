const test = require('node:test');
const assert = require('node:assert/strict');
const { storageStateIsValid } = require('../lib/dice-session');
const { NEWDAY_LOOKBACK_MS } = require('../lib/job-scanner');

test('storageStateIsValid validates presence of cookies and origins arrays', () => {
  assert.equal(storageStateIsValid(null), false);
  assert.equal(storageStateIsValid({}), false);
  assert.equal(storageStateIsValid({ cookies: [] }), false);
  assert.equal(storageStateIsValid({ origins: [] }), false);
  assert.equal(storageStateIsValid({ cookies: [], origins: [] }), true);
  assert.equal(storageStateIsValid({ cookies: [{ name: 'session' }], origins: ['https://dice.com'] }), true);
});

test('NEWDAY_LOOKBACK_MS is configured to 24 hours', () => {
  assert.equal(NEWDAY_LOOKBACK_MS, 24 * 60 * 60 * 1000);
});

test('telegram-notify exports getBot, sendMessage, and sendMessageWithButtons', () => {
  const notify = require('../lib/telegram-notify');
  assert.equal(typeof notify.getBot, 'function');
  assert.equal(typeof notify.sendMessage, 'function');
  assert.equal(typeof notify.sendMessageWithButtons, 'function');
});

test('job-scanner exports expected functions', () => {
  const scanner = require('../lib/job-scanner');
  assert.equal(typeof scanner.readJobUrls, 'function');
  assert.equal(typeof scanner.getJobsPendingPreflight, 'function');
  assert.equal(typeof scanner.updateJobPreflightStatus, 'function');
});

test('pending-answers exports expected functions', () => {
  const pending = require('../lib/pending-answers');
  assert.equal(typeof pending.savePendingQuestion, 'function');
  assert.equal(typeof pending.findActivePendingQuestion, 'function');
  assert.equal(typeof pending.recordPendingAnswer, 'function');
  assert.equal(typeof pending.getAnswerForQuestion, 'function');
  assert.equal(typeof pending.clearExpiredPendingQuestions, 'function');
});
