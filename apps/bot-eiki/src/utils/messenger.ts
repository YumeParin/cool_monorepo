// src/utils/messenger.ts
import {
  Channel,
  MessagePayload,
  MessageCreateOptions,
  EmbedBuilder,
} from 'discord.js';

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

export async function sendMessageEmbed(
  channel: Channel | undefined | null,
  content: string | null, // Simplifié pour accepter null sans erreur TS
  embed: EmbedBuilder
) {
  // If the channel doesn't exist, we just quietly return to avoid stress
  if (!channel || !channel.isSendable()) {
    console.warn('Attempted to send a message to a non-sendable channel.');
    return;
  }

  try {
    // On prépare le payload d'envoi proprement
    const payload: MessageCreateOptions = {
      embeds: [embed],
    };

    // Si tu as passé du texte en plus de l'embed, on l'ajoute au payload
    if (content) {
      payload.content = content;
    }

    // On envoie le tout !
    await channel.send(payload);
  } catch (error) {
    const channelName = 'name' in channel ? channel.name : 'Direct Message';
    console.error(`Failed to send embed to ${channelName}:`, error);
  }
}
