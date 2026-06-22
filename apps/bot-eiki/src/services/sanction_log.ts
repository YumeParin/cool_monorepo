import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
  ColorResolvable,
} from 'discord.js';

import { sendMessageEmbed } from '../utils/messenger';
import { utils } from '@swissokyo/api-client';

// 1. On définit strictement les types de sanctions autorisées.
// Si tu essaies de passer 'mute' plus tard sans l'ajouter ici, TS va te bloquer !
export type SanctionAction = 'gap' | 'ungap' | 'kick' | 'ban';

// 2. On crée un "dictionnaire" pour associer l'action à son texte d'affichage.
// C'est beaucoup plus propre que de faire 4 "if" à la suite.
const SANCTION_LABELS: Record<SanctionAction, string> = {
  gap: 'Barrier lock out',
  ungap: 'Barrier unlock',
  kick: 'Kicked',
  ban: 'Banned',
};

/**
 * Logs a moderation action (sanction) to the designated log channel.
 */
export async function sanction_log(
  interaction: ChatInputCommandInteraction,
  type: SanctionAction
): Promise<void> {
  // 3. On récupère le serveur directement via l'interaction, pas besoin d'importer 'client' !
  const guild = interaction.guild;
  if (!guild) return;

  const barrierLogChannelId =
    await utils.server.getServerBarrierLoggingChannelId(guild.id);
  if (!barrierLogChannelId) {
    // We do nothing, since there are no barrierLogChannel, we don't log
    return;
  }
  // 4. On cherche le salon de log et on s'assure que c'est bien un salon textuel
  const sanctionLogChannel = guild.channels.cache.get(barrierLogChannelId) as
    | TextChannel
    | undefined;

  if (!sanctionLogChannel) {
    console.warn(
      `[Sanction Log] Could not find channel with ID ${barrierLogChannelId}`
    );
    // We do nothing since there are no barrierLogChannel, we don't log
    return;
  }

  // 5. Récupération des données saisies par le modérateur
  const targetUser = interaction.options.getUser('member');
  const reason =
    interaction.options.getString('reason') ?? 'No reason provided';
  const proofAttachment = interaction.options.getAttachment('proof');

  // Sécurité au cas où la commande est mal configurée et qu'il n'y a pas d'utilisateur
  if (!targetUser) return;

  // 6. Configuration du visuel (Couleur et Texte)
  const sanctionText = SANCTION_LABELS[type];
  const isPositiveAction = type === 'ungap';
  const embedColor: ColorResolvable = isPositiveAction ? '#44ff44' : '#ff4444';

  // 7. Construction de l'Embed
  const sanctionLogEmbed = new EmbedBuilder()
    .setTitle('Sanction Log')
    .setDescription(`<@${targetUser.id}>\n- **${sanctionText}**\n${reason}`)
    .setColor(embedColor)
    .setFooter({
      text: `Action by: ${interaction.user.tag} (${interaction.user.id})`,
      iconURL: interaction.user.displayAvatarURL(),
    });

  // 8. Gestion de l'image de preuve
  if (proofAttachment && proofAttachment.url) {
    sanctionLogEmbed.setImage(proofAttachment.url);
  } else {
    // Si on n'a pas d'image, on prévient dans le footer
    sanctionLogEmbed.setFooter({
      text: `Action by: ${interaction.user.tag} | No proof provided`,
      iconURL: interaction.user.displayAvatarURL(),
    });
  }

  // 9. Envoi du message via ta fonction utilitaire
  await sendMessageEmbed(sanctionLogChannel, null, sanctionLogEmbed);
}
