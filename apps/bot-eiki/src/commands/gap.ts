import { api, utils } from '@swissokyo/api-client';
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';
import { sanction_log } from '../services/sanction_log';

// N'oublie pas d'importer tes constantes et tes fonctions utilitaires
// import { ADMIN_ROLES } from '../constants/globals';
// import { server_sanction, server_sanction_log } from '../utils/sanctions';

export const data: SlashCommandOptionsOnlyBuilder = new SlashCommandBuilder()
  .setName('gap')
  .setDescription('Gap a member')
  .addUserOption((option) =>
    option
      .setName('member')
      .setDescription('The member to gap')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('reason')
      .setDescription('The reason for the gap')
      .setRequired(true)
  )
  .addAttachmentOption((option) =>
    option
      .setName('proof')
      .setDescription('Screenshot as proof')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    // 1. Guard clauses (vérifications de base)
    if (!interaction.inGuild() || !interaction.guild) {
      await interaction.reply({
        content: 'This command can only be used in a server.',
        ephemeral: true,
      });
      return;
    }

    // On dit explicitement à TS que member est un GuildMember (et non un APIInteractionGuildMember)
    const interactionMember = interaction.member as GuildMember;

    const moderatorRoleId = await utils.server.getServerModeratorRoleId(
      interaction.guild.id
    );
    if (!moderatorRoleId) {
      await interaction.reply({
        content:
          'Please configure the moderator role first using /configure command.',
        ephemeral: true,
      });
      return;
    }

    const hasPermission = interactionMember.roles.cache.some(
      (role) => role.id === moderatorRoleId
    );

    if (!hasPermission) {
      await interaction.reply({
        content: "You don't have the permission to use this command.",
        ephemeral: true,
      });
      return;
    }

    // 2. Extraction des options
    // On type targetMember pour avoir accès plus tard à targetMember.id ou .user
    const targetMember = interaction.options.getMember('member') as GuildMember;
    const reason = interaction.options.getString('reason', true);
    const proof = interaction.options.getAttachment('proof', true);

    // 3. Validation de l'image
    if (!proof.contentType?.startsWith('image/')) {
      await interaction.reply({
        content: 'The proof must be a valid image file.',
        ephemeral: true,
      });
      return;
    }

    // 4. On prévient Discord qu'on réfléchit (Low cortisol API flow)
    await interaction.deferReply({ ephemeral: true });

    // 5. Exécution de la logique métier
    const type = 'gap';

    //6. Log the action using the sanction_log function
    await sanction_log(interaction, type);

    // 7. Add the Gapped role to the target member
    let gappedRole = interaction.guild.roles.cache.find(
      (role) => role.name === 'Gapped'
    );
    if (!gappedRole) {
      await interaction.reply({
        content: 'Gapped role does not exist. Please create it first.',
        ephemeral: true,
      });
      return;
    }

    // Execute the gap
    await targetMember.roles.add(gappedRole);
    console.log(`Added Gapped role to ${targetMember.user.tag}`);
    // await server_sanction(interaction.guildId, interaction, type);

    // 6. Confirmation finale
    await interaction.editReply({
      content: `Successfully gapped <@${targetMember.id}>!`,
    });
  } catch (error) {
    console.error('Gap error:', error);

    const friendlyMessage =
      error instanceof Error
        ? error.message
        : 'Something went sideways with the database or API.';

    // Fallback de sécurité si ça crash à n'importe quel moment
    if (interaction.replied || interaction.deferred) {
      await interaction.editReply({
        content: `❌ Gap failed: ${friendlyMessage}`,
      });
    } else {
      await interaction.reply({
        content: `❌ Gap failed: ${friendlyMessage}`,
        ephemeral: true,
      });
    }
  }
}
