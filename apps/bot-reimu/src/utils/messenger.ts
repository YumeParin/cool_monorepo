// src/utils/messenger.ts
import { Channel, MessagePayload, MessageCreateOptions } from 'discord.js';

export async function sendMessage(
  channel: Channel | undefined | null,
  content: string | MessagePayload | MessageCreateOptions
) {
  // If the channel doesn't exist, we just quietly return to avoid stress
  if (!channel || !channel.isSendable()) {
    console.warn('Attempted to send a message to a non-sendable channel.');
    return;
  }

  try {
    await channel.send(content);
  } catch (error) {
    const channelName = 'name' in channel ? channel.name : 'Direct Message';
    console.error(`Failed to send message to ${channelName}:`, error);
  }
}
