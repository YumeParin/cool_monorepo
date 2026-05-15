// src/events/message.ts
import { Message } from 'discord.js';

export function handleMessage(message: Message) {
  // Ignore bots to prevent infinite loops
  if (message.author.bot) return;

  console.log(`Message from ${message.author.tag}: ${message.content}`);
}
