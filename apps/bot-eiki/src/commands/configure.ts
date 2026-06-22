import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
  ChannelType, // 1. Import ChannelType
} from 'discord.js';
import { api, utils } from '@swissokyo/api-client';

export const data: SlashCommandOptionsOnlyBuilder = new SlashCommandBuilder()
  .setName('configure')
  .setDescription('Begin configuration of the bot')
  .addChannelOption((option) =>
    option
      .setName('barrier_channel')
      .setDescription(
        'Where should I gap suspect members ? (Leave empty for none)'
      )
      .addChannelTypes(ChannelType.GuildText) // 2. Restrict to Text Channels only
      .setRequired(false)
  )
  .addChannelOption((option) =>
    option
      .setName('barrier_log_channel')
      .setDescription(
        'Where should I log the gapped members ? (Leave empty for none)'
      )
      .addChannelTypes(ChannelType.GuildText) // 2. Restrict to Text Channels only
      .setRequired(false)
  )
  .addRoleOption((option) =>
    option
      .setName('moderator_role')
      .setDescription(
        'What role should be considered as a moderator ? (Leave empty for none)'
      )
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    if (!interaction.guild) {
      await interaction.reply({
        content: 'This command can only be used in a server, sorry!',
        ephemeral: true,
      });
      return;
    }

    const ownerId = interaction.guild.ownerId;

    if (interaction.user.id !== ownerId) {
      await interaction.reply({
        content: 'You are not the boss ! Only the owner can use this command',
        ephemeral: true,
      });
      return;
    }

    // 1. Acknowledge immediately to give the API time
    await interaction.reply({
      content: "Let's begin the configuration!",
    });

    // 2. Extract the answers Discord already validated for you
    const barrierChannel = interaction.options.getChannel('barrier_channel');
    const barrierLogChannel = interaction.options.getChannel(
      'barrier_log_channel'
    );
    const moderatorRole = interaction.options.getRole('moderator_role');
    console.log(`moderatorRole: ${moderatorRole?.name} (${moderatorRole?.id})`);
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
      barrierChannelId: barrierChannel?.id || null,
      barrierLoggingChannelId: barrierLogChannel?.id || null,
      moderatorRoleId: moderatorRole?.id || null,
    });

    // 5. Final confirmation
    await interaction.editReply(
      `Server config edited successfully!\n` +
        `Barrier Channel: ${barrierChannel ? `<#${barrierChannel.id}>` : 'None'}\n` +
        `Barrier Log Channel: ${barrierLogChannel ? `<#${barrierLogChannel.id}>` : 'None'}\n` +
        `Moderator Role: ${moderatorRole ? `<@&${moderatorRole.id}>` : 'None'}\n`
    );
  } catch (error) {
    console.error(error);

    const friendlyMessage =
      error instanceof Error
        ? error.message
        : 'Something went sideways with the API.';

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
