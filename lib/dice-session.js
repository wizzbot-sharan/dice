const { createServiceClient } = require('./azure');

const azure = createServiceClient();

function storageStateIsValid(storageState) {
  return Boolean(storageState) && Array.isArray(storageState.cookies) && Array.isArray(storageState.origins);
}

async function getSessionRow(chatId) {
  const { data, error } = await azure
    .from('dice_sessions')
    .select('telegram_chat_id, client_id, email, applywizz_id, storage_state')
    .eq('telegram_chat_id', chatId)
    .maybeSingle();

  if (error) {
    console.error(`[User ${chatId}] Failed to load Dice session row:`, error.message);
    return null;
  }
  return data;
}

async function readActiveSession(chatId) {
  const data = await getSessionRow(chatId);
  if (!data || !storageStateIsValid(data.storage_state)) return null;

  return {
    chatId,
    email: data.email,
    applywizz_id: data.applywizz_id,
    clientId: data.client_id,
    storageState: data.storage_state,
  };
}

async function getClientIdForChat(chatId) {
  const { data, error } = await azure
    .from('dice_telegram_connection')
    .select('client_id')
    .eq('telegram_chat_id', chatId)
    .maybeSingle();

  if (error) {
    console.error(`[User ${chatId}] Failed to load telegram link:`, error.message);
    return null;
  }
  return data?.client_id || null;
}

async function saveSession(context, chatId, email, applywizz_id, clientId) {
  const storageState = await context.storageState();
  const resolvedClientId = clientId || await getClientIdForChat(chatId);
  if (!resolvedClientId) {
    throw new Error('Cannot save Dice session: Telegram chat is not linked to a client.');
  }

  // Clear any stale dice_sessions for this client under older chat IDs
  await azure
    .from('dice_sessions')
    .delete()
    .eq('client_id', resolvedClientId)
    .neq('telegram_chat_id', chatId);

  const { error } = await azure.from('dice_sessions').upsert(
    {
      telegram_chat_id: chatId,
      client_id: resolvedClientId,
      email,
      applywizz_id: applywizz_id || null,
      storage_state: storageState,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'telegram_chat_id' }
  );
  if (error) throw new Error(`Could not save Dice session: ${error.message}`);

  return {
    chatId,
    email,
    applywizz_id,
    clientId: resolvedClientId,
    storageState,
  };
}

async function linkTelegramChat(chatId, clientId) {
  // Check if any other telegram_chat_id was previously linked to this client
  const { data: previousLinks, error: lookupError } = await azure
    .from('dice_telegram_connection')
    .select('telegram_chat_id')
    .eq('client_id', clientId)
    .neq('telegram_chat_id', chatId);

  if (lookupError) {
    console.error(`[User ${chatId}] Could not check previous links:`, lookupError.message);
  }

  if (Array.isArray(previousLinks) && previousLinks.length > 0) {
    for (const link of previousLinks) {
      const oldChatId = link.telegram_chat_id;
      console.log(`[User ${chatId}] Client ${clientId} was previously linked to Telegram Chat ${oldChatId}. Replacing with new chat ${chatId}.`);
    }

    // Delete old links and sessions for this client (except current chatId)
    await azure
      .from('dice_telegram_connection')
      .delete()
      .eq('client_id', clientId)
      .neq('telegram_chat_id', chatId);

    await azure
      .from('dice_sessions')
      .delete()
      .eq('client_id', clientId)
      .neq('telegram_chat_id', chatId);
  }

  const { error } = await azure.from('dice_telegram_connection').upsert(
    {
      telegram_chat_id: chatId,
      client_id: clientId,
      linked_at: new Date().toISOString(),
    },
    { onConflict: 'telegram_chat_id' }
  );

  if (error) {
    throw new Error(`Failed to save telegram link: ${error.message}`);
  }
}

async function getAllRegisteredUsers() {
  const { data, error } = await azure.from('dice_sessions').select('telegram_chat_id');
  if (error) {
    console.error('Failed to list Dice sessions:', error.message);
    return [];
  }
  return (data || []).map((row) => Number(row.telegram_chat_id));
}

async function getSessionsPendingLogin() {
  const { data, error } = await azure
    .from('dice_sessions')
    .select('telegram_chat_id, client_id, email, applywizz_id, storage_state')
    .is('storage_state', null);

  if (error) {
    console.error('Failed to list sessions pending login:', error.message);
    return [];
  }
  return data || [];
}

module.exports = {
  storageStateIsValid,
  getSessionRow,
  readActiveSession,
  getClientIdForChat,
  saveSession,
  linkTelegramChat,
  getAllRegisteredUsers,
  getSessionsPendingLogin,
};
