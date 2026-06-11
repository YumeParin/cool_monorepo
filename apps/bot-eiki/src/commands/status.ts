import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Know the current status of the servers bots');

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    if (!interaction.guild) {
      await interaction.reply({
        content: 'This command can only be used in a server, sorry!',
      });
      return;
    }
    const ownerId = interaction.guild!.ownerId;

    if (interaction.user.id === ownerId) {
      await interaction.reply({ content: "Let's begin the configuration" });

      return;
    } else {
      await interaction.reply({
        content: "Ya'are not the boss ! Only the owner can use this command",
      });
      return;
    }
  } catch (error) {
    await interaction.reply({
      content: 'Sorry...I got an error...',
    });
  }
}
