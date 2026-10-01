const test = require('node:test');
const assert = require('node:assert/strict');
const { sendJobPrompt, applyPromptDecision } = require('../lib/bot-prompt-handler');

test('sendJobPrompt includes unknown questions in prompt text', async () => {
  let sentText = '';
  const store = { recordPrompt: async () => {} };
  const queue = { updateJobStatus: async () => {} };
  let patched = {};

  await sendJobPrompt({
    chatId: 123,
    job: { url: 'http://test.com', id: 1 },
    sessionDeadlineMs: Date.now() + 100000,
    workflowStateStore: store,
    applyQueue: queue,
    audit: async () => {},
    sendMessageWithButtons: async (chatId, text, buttons) => {
      sentText = text;
    },
    persistWorkflowPatch: async (chatId, patch) => {
      patched = patch;
    },
    unknownQuestions: [{ text: 'How many years?', type: 'text', options: [] }]
  });

  assert.ok(sentText.includes('1 question(s) that need your answers'), 'Missing warning in prompt');
  assert.ok(patched.pending_preflight_questions.includes('How many years?'), 'Missing workflow state');
});
