const test = require('node:test');
const assert = require('node:assert/strict');
const { createWorkflowStateStore } = require('../lib/workflow-state');

test('claimTelegramUpdate rejects duplicate update_id', async () => {
  const rows = new Map();
  const azure = {
    from(table) {
      const state = { chatId: null, upsertValues: null };
      const builder = {
        select() {
          return builder;
        },
        eq(_col, chatId) {
          state.chatId = chatId;
          return builder;
        },
        maybeSingle: async () => ({
          data: rows.get(state.chatId) || null,
          error: null,
        }),
        upsert(values) {
          state.upsertValues = values;
          return builder;
        },
        single: async () => {
          const chatId = state.upsertValues.telegram_chat_id;
          const prev = rows.get(chatId) || {};
          const merged = { ...prev, ...state.upsertValues };
          rows.set(chatId, merged);
          return { data: merged, error: null };
        },
      };
      return builder;
    },
  };

  const store = createWorkflowStateStore(azure);
  const chatId = 777;
  assert.equal(await store.claimTelegramUpdate(chatId, 10), true);
  assert.equal(await store.claimTelegramUpdate(chatId, 10), false);
  assert.equal(await store.claimTelegramUpdate(chatId, 11), true);
});
