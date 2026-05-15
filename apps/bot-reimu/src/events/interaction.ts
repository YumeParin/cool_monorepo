// src/events/interaction.ts
import { Interaction, Collection } from 'discord.js';
import { commands, Command } from '../commands/index.js';

// Build the registry once when this module loads
const registry = new Collection<string, Command>();
for (const cmd of commands) {
  registry.set(cmd.data.name, cmd);
}

export async function handleInteraction(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  const cmd = registry.get(interaction.commandName);
  if (!cmd) return;

  try {
    await cmd.execute(interaction);
  } catch (err) {
    console.error('Command failed:', err);

    const errorPayload = { content: 'An error occurred.', ephemeral: true };
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(errorPayload);
    } else {
      await interaction.reply(errorPayload);
    }
  }
}
