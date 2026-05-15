// src/bot-eiki/events/guildMemberAdd.ts
import { GuildMember, TextChannel } from 'discord.js';
import { sendMessage } from '../utils/messenger';
import { ServerConfig } from '../config/config';
import { WELCOME_MESSAGES } from '../constants/messages';
import { getRandomItem } from '../utils/random';

export async function handleJoin(member: GuildMember) {
  if (member.user.bot) return;

  const rawMessage = getRandomItem(WELCOME_MESSAGES);

  const formattedMessage = rawMessage.replace('{user}', member.user.toString());

  const welcomeChannel = member.guild.channels.cache.get(
    ServerConfig.welcomeChannelId
  ) as TextChannel;

  // Use the shared utility
  await sendMessage(welcomeChannel, formattedMessage);
}
