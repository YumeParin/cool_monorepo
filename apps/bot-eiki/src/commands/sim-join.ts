import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { handleJoin } from '../events/join.js';

export const data = new SlashCommandBuilder()
  .setName('sim-join')
  .setDescription('Simulate a user joining the server');

export async function execute(interaction: ChatInputCommandInteraction) {
  // Only let YOU run this
  if (interaction.user.id !== '964500024706863134') return;

  // Pass your own member object into the join logic to simulate a new arrival
  if (interaction.member) {
    await handleJoin(interaction.member as any);
    await interaction.reply({
      content: 'Simulated join event.',
      ephemeral: true,
    });
  }
}
