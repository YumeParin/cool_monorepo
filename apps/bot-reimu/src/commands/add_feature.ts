import { api } from '@swissokyo/api-client';
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export const data: SlashCommandOptionsOnlyBuilder = new SlashCommandBuilder()
  .setName('add_feature')
  .setDescription('Activate specialized bots for your server')
  .addStringOption((option) =>
    option
      .setName('bot')
      .setDescription('Which bot feature do you want to configure?')
      .setRequired(true)
      .addChoices(
        { name: 'Shiki Eiki (Moderation & Barrier)', value: 'shiki' },
        { name: 'Aya Shameimaru (Server Logging)', value: 'aya' }
      )
  );
export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    if (
      !interaction.guild ||
      interaction.user.id !== interaction.guild.ownerId
    ) {
      await interaction.reply({
        content: 'Only the server owner can configure new bots!',
        ephemeral: true,
      });
      return;
    }

    // 1. Verify the server is already registered
    try {
      // We don't even need to save the result to a variable if we just want to verify it exists
      await api.servers.getById(interaction.guild.id);
    } catch (error) {
      // If the API throws an error (e.g., 404 Not Found), the server isn't registered yet.
      await interaction.reply({
        content:
          "I don't recognize this server yet! Please run `/configure` first so I can set up my database.",
        ephemeral: true,
      });
      return; // Completely stop the command here so we don't generate invite links
    }

    // 2. If we made it past the check, the server exists! Proceed as normal.
    const selectedBot = interaction.options.getString('bot');

    const AYA_CLIENT_ID = '123456789012345678';
    const SHIKI_CLIENT_ID = '987654321098765432';

    let inviteLink = '';
    let botName = '';

    if (selectedBot === 'aya') {
      botName = 'Aya Shameimaru';
      inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${AYA_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`;
    } else if (selectedBot === 'shiki') {
      botName = 'Shiki Eiki';
      inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${SHIKI_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`;
    }

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel(`Invite ${botName} to the Server`)
        .setStyle(ButtonStyle.Link)
        .setURL(inviteLink)
    );

    await interaction.reply({
      content: `I cannot bypass Discord's security to add ${botName} myself, but you can securely invite her by clicking the button below!`,
      components: [row],
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
    // This outer catch block now only handles unexpected crashes (like Discord API failing)
    await interaction.reply({
      content: 'Got an unexpected error trying to generate the invite link.',
      ephemeral: true,
    });
  }
}
