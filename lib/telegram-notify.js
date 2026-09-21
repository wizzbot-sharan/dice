const { Bot } = require('node-telegram-bot-api');

let botInstance = null;

function getBot() {
  if (!botInstance) {
    const token = process.env.BOT_TOKEN;
    if (!token) {
      throw new Error('BOT_TOKEN must be set in the environment.');
    }
    botInstance = new Bot(token);
  }
  return botInstance;
}

async function sendMessage(chatId, text, options = {}) {
  try {
    const bot = getBot();
    await bot.api.sendMessage({ chat_id: chatId, text, ...options });
    return true;
  } catch (error) {
    console.error(`[User ${chatId}] Telegram message failed:`, error.message);
    return false;
  }
}

function sendMessageWithButtons(chatId, text, buttons) {
  return sendMessage(chatId, text, {
    reply_markup: {
      inline_keyboard: buttons,
    },
  });
}

module.exports = {
  getBot,
  sendMessage,
  sendMessageWithButtons,
};
