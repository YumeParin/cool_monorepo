// src/utils/messenger.ts
import { TextChannel, MessagePayload, MessageCreateOptions } from 'discord.js';

export async function sendMessage(
  channel: TextChannel | undefined | null,
  content: string | MessagePayload | MessageCreateOptions
) {
  // If the channel doesn't exist, we just quietly return to avoid stress
  if (!channel) {
    console.warn('Attempted to send a message to a non-existent channel.');
    return;
  }

  try {
    await channel.send(content);
  } catch (error) {
    console.error(`Failed to send message to ${channel.name}:`, error);
  }
}
