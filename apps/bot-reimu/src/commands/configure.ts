import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { api, utils } from '@swissokyo/api-client';
import { SlashCommandOptionsOnlyBuilder } from 'discord.js';
import { util } from 'zod/v4/core';

export const data: SlashCommandOptionsOnlyBuilder = new SlashCommandBuilder()
  .setName('configure')
  .setDescription('Begin configuration of the bot')
  // Question 2: Welcome Channel
  .addChannelOption((option) =>
    option
      .setName('welcome_channel')
      .setDescription(
        'Where should I welcome new members? (Leave empty for none)'
      )
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    if (!interaction.guild) {
      await interaction.reply({
        content: 'This command can only be used in a server, sorry!',
        ephemeral: true, // Only the user sees this
      });
      return;
    }

    const ownerId = interaction.guild.ownerId;

    if (interaction.user.id !== ownerId) {
      await interaction.reply({
        content: "Ya'are not the boss ! Only the owner can use this command",
        ephemeral: true,
      });
      return;
    }

    // 1. Acknowledge immediately to give the API time
    await interaction.reply({
      content: "Let's begin the configuration!",
    });

    // 2. Extract the answers Discord already validated for you
    // const otherAdmins = interaction.options.getMember('other_admins'); // Returns string or null
    const welcomeChannel = interaction.options.getChannel('welcome_channel'); // Returns channel object or null

    // 3. First, create the server
    const isRegistered = await utils.server.isServerAlreadyRegistered(
      interaction.guild.id
    );
    if (!isRegistered) {
      await api.servers.create(interaction.guild.id);
    }

    // 4. Then, update it with the new configuration
    await api.servers.edit({
      discordId: interaction.guild.id,
      welcomeChannelId: welcomeChannel?.id || null,
    });

    // 5. Final confirmation
    await interaction.editReply(
      `Server config edited successfully!\n` +
        `Welcome Channel: ${welcomeChannel ? `<#${welcomeChannel.id}>` : 'None'}\n`
    );
  } catch (error) {
    console.error(error);

    const friendlyMessage =
      error instanceof Error
        ? error.message
        : 'Something wen sideways with the API.';

    // If the reply was already sent, edit it to show the error. Otherwise, reply.
    if (interaction.replied || interaction.deferred) {
      await interaction.editReply({
        content: `❌ Configuration failed: ${friendlyMessage}`,
      });
    } else {
      await interaction.reply({
        content: `❌ Configuration failed: ${friendlyMessage}`,
        ephemeral: true,
      });
    }
  }
}
