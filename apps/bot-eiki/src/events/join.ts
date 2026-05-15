// src/bot-eiki/events/guildMemberAdd.ts
import { GuildMember, TextChannel } from 'discord.js';
import { sendMessage } from '../utils/messenger';
import { ServerConfig } from '../config/config';

export async function handleJoin(member: GuildMember) {
  if (member.user.bot) return;

  console.log(`Member joined: ${member.user.tag}`);

  // Fetch the channel using your config (assuming config is already set up)
  const welcomeChannel = member.guild.channels.cache.get(
    ServerConfig.welcomeChannelId
  ) as TextChannel;

  // Use the shared utility
  await sendMessage(
    welcomeChannel,
    `It's not my job to welcome new members but... Welcome ${member.user.toString()}!`
  );
}
