const fs = require('fs');

const filesToUpdate = [
  'start-bot.js',
  'start-worker.js',
  'lib/job-application-db.js',
  'lib/telegram-notify.js',
  'lib/dice-session.js'
];

for (const file of filesToUpdate) {
  let content = fs.readFileSync(file, 'utf8');

  // Check if we need to add the import
  if (content.includes('[User ${chatId}]') && !content.includes('getClientPrefix')) {
    const importStatement = `const { getClientPrefix } = require('${file.startsWith('lib/') ? './logger' : './lib/logger'}');\n`;
    
    // Insert after dotenv or at top
    if (content.includes("require('dotenv').config();")) {
      content = content.replace("require('dotenv').config();", "require('dotenv').config();\n" + importStatement);
    } else {
      content = importStatement + content;
    }
  }

  // Replace [User ${chatId}] with ${await getClientPrefix(chatId)}
  content = content.replace(/\[User \$\{chatId\}\]/g, '${await getClientPrefix(chatId)}');
  
  // Make onAbort async in start-worker
  if (file === 'start-worker.js') {
    content = content.replace('const onAbort = () => {', 'const onAbort = async () => {');
  }

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
}
