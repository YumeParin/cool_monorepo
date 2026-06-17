import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
} from 'discord.js';
import { handleJoin } from '../events/join.js';

export const data = new SlashCommandBuilder()
  .setName('sim-join')
  .setDescription('Simulate a user joining the server');

export async function execute(interaction: ChatInputCommandInteraction) {
  // Only let YOU run this
  if (interaction.user.id !== '964500024706863134') return;

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  if (!interaction.guild) {
    await interaction.editReply({ content: 'This must be used in a server.' });
    return;
  }

  try {
    // 1. Ask Discord for the specific member object
    const targetId = '1442976581407604789';
    const targetMember = await interaction.guild.members.fetch(targetId);

    // 2. Pass that specific member into your master plan
    await handleJoin(targetMember);

    await interaction.editReply({
      content: `Simulated join event successfully for <@${targetId}>.`,
    });
  } catch (error) {
    // If the user ID isn't actually in the server, the fetch will fail
    console.error(error);
    await interaction.editReply({
      content:
        'Simulation failed. Are you sure that user ID is currently in the server?',
    });
  }
}
