// src/index.ts
import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { handleInteraction } from './events/interaction';
import { handleMessage } from './events/message';
import { handleJoin } from './events/join';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Event Routing
client.once('clientReady', (c) =>
  console.log(`Eiki is online as ${c.user.tag}`)
);
client.on('messageCreate', handleMessage);
client.on('interactionCreate', handleInteraction);
client.on('guildMemberAdd', handleJoin);

client.login(process.env.DISCORD_EIKI_TOKEN).catch((err) => {
  console.error('Fatal: Login failed:', err);
  process.exit(1);
});
