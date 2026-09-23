const test = require('node:test');
const assert = require('node:assert/strict');
const { createDueWorkTicker, ENQUEUE_BATCH_CAP } = require('../lib/due-work-ticker');

test('due-work ticker enqueues at most ENQUEUE_BATCH_CAP jobs', async () => {
  const enqueued = [];
  const ticker = createDueWorkTicker({
    getClientIdForChat: async () => 'client-1',
    loadApplyProfile: async () => ({ applywizz_id: 'awl-1' }),
    readJobUrls: async () => Array.from({ length: 20 }, (_, i) => ({
      id: `job-${i}`,
      url: `https://dice.com/job/${i}`,
      applywizzId: 'awl-1',
    })),
    applyQueue: {
      countActiveQueueItems: async () => 0,
      hasActiveClientJob: async () => false,
      getReadyPreflightPassedJobs: async () => [],
      enqueueApplyJob: async (payload) => {
        enqueued.push(payload);
        return { created: true };
      },
    },
    saveAppliedJob: async () => {},
    workflowStateStore: {
      save: async () => ({}),
    },
    audit: async () => {},
    sendMessage: async () => true,
    sendMessageWithButtons: async () => true,
    azure: {},
  });

  await ticker.processDueChat({
    telegram_chat_id: 123,
    session_deadline: new Date(Date.now() + 3600000).toISOString(),
    current_prompt_token: null,
    newday_requested_at: new Date().toISOString(),
    completion_notified: false,
    last_decision: null,
  });

  assert.equal(enqueued.length, ENQUEUE_BATCH_CAP);
});

test('due-work ticker skips chat with active unexpired prompt', async () => {
  let sent = false;
  const ticker = createDueWorkTicker({
    getClientIdForChat: async () => 'client-1',
    loadApplyProfile: async () => ({}),
    readJobUrls: async () => [],
    applyQueue: {
      countActiveQueueItems: async () => 0,
      hasActiveClientJob: async () => false,
      getReadyPreflightPassedJobs: async () => [{ id: 'q1', url: 'https://x' }],
    },
    saveAppliedJob: async () => {},
    workflowStateStore: { save: async () => ({}) },
    audit: async () => {},
    sendMessage: async () => { sent = true; return true; },
    sendMessageWithButtons: async () => true,
    azure: {},
  });

  await ticker.processDueChat({
    telegram_chat_id: 456,
    session_deadline: new Date(Date.now() + 3600000).toISOString(),
    current_prompt_token: 'tok',
    current_prompt_expires_at: new Date(Date.now() + 600000).toISOString(),
  });

  assert.equal(sent, false);
});
