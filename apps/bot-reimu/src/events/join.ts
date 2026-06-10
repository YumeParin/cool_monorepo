// src/bot-eiki/events/guildMemberAdd.ts
import { GuildMember, TextChannel } from 'discord.js';
import { sendMessage } from '../utils/messenger';
import { ServerConfig } from '../config/config';
import { WELCOME_MESSAGES } from '../constants/messages';
import { getRandomItem } from '../utils/random';
import { api } from '@swissokyo/api-client';

export async function handleJoin(member: GuildMember) {
  if (member.user.bot) return;

  try {
    const response = await api.servers.getById(member.guild.id);
    // const response = await api.servers.getById('12345678910111213115');
    console.log(response);
    const rawMessage = getRandomItem(WELCOME_MESSAGES);

    const formattedMessage = rawMessage.replace(
      '{user}',
      member.user.toString()
    );
    if (!response.data.welcomeChannelId) {
      return;
    }
    const welcomeChannel = member.guild.channels.cache.get(
      response.data.welcomeChannelId
    ) as TextChannel;
    await sendMessage(welcomeChannel, formattedMessage);
  } catch (error) {
    // If we got an error that the server was not found, then it means it wasn't configured yet
    return;
  }
}
