const tmi = require('tmi.js');
const keep_alive = require('.keep_alive.js')
const mySecret = process.env['TOKEN']
const cooldowns = {}; // Kullanıcıların soğuma sürelerini takip edeceğimiz nesne
const cooldownTime = 10; // 10 saniye soğuma süresi

const client = new tmi.Client({
  options: { debug: true },
  identity: {
    username: 'BotTutor',
    password: process.env.TOKEN
  },
  channels: ['sibertutor']
});

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  const command = message.toLowerCase();

  // Komutların işlenmesi
  switch (command) {
    case '!dc':
    case '!yt':
    case '!insta':
    case '!link':
      handleCommandWithCooldown(channel, tags, command.substr(1)); // Komut adını alırken ! işaretini çıkar
      break;
    default:
      break;
  }
});

function handleCommandWithCooldown(channel, tags, commandName) {
  const userId = tags['user-id'];

  if (!cooldowns[userId]) {
    // Kullanıcıya henüz bir soğuma süresi atanmamışsa
    cooldowns[userId] = {};
  }

  const now = Date.now();
  const userCooldown = cooldowns[userId][commandName] || 0;

  if (now - userCooldown > cooldownTime * 1000) {
    // Kullanıcıya izin verme, komutu işle
    cooldowns[userId][commandName] = now;
    
    switch (commandName) {
      case 'dc':
        client.say(channel, `@${tags.username}, https://discord.gg/CVnB7uxf3A`);
        break;
      case 'yt':
        client.say(channel, `@${tags.username}, youtube.com/@siberTutor`);
        break;
      case 'insta':
        client.say(channel, `@${tags.username}, instagram.com/sibertutor`);
        break;
      case 'link':
        client.say(channel, `@${tags.username}, https://linktr.ee/sibertutor`);
        break;
      default:
        break;
    }
  } else {
    // Kullanıcıya soğuma süresi var, uyarı ver
    client.say(channel, `@${tags.username}, bu komutu tekrar kullanmadan önce ${cooldownTime} saniye beklemelisiniz.`);
  }
}
