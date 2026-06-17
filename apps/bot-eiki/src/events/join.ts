// src/bot-eiki/events/guildMemberAdd.ts
import { GuildMember, TextChannel, PermissionFlagsBits } from 'discord.js';
import { sendMessage } from '../utils/messenger';
// import { sendWelcomeMessage } from '../utils/wherever-this-is'; // Ensure you have this
import { WELCOME_MESSAGES } from '../constants/messages';
import { getRandomItem } from '../utils/random';
import { api } from '@swissokyo/api-client';

export async function handleJoin(member: GuildMember) {
  if (member.user.bot) return;

  try {
    const guild = member.guild;

    // 1. Get the server configuration
    const { success, data } = await api.servers.getById(guild.id);
    const { barrierChannelId, barrierLoggingChannelId } = data; // Assuming you have welcomeChannelId in data

    if (!barrierChannelId) return;

    const barrierChannel = guild.channels.cache.get(
      barrierChannelId
    ) as TextChannel;
    if (!barrierChannel) return;

    // 2. Time Calculations
    const accountAge = Date.now() - member.user.createdTimestamp;
    const twoMonths = 2 * 31 * 24 * 60 * 60 * 1000;
    const threeMonths = 3 * 31 * 24 * 60 * 60 * 1000;
    // const tenYears = 10 * 365 * 24 * 60 * 60 * 1000;

    // 3. The "Gapped" Logic
    if (accountAge < threeMonths) {
      let gappedRole = guild.roles.cache.find((role) => role.name === 'Gapped');

      // If the role doesn't exist, execute Opaline's master plan
      if (!gappedRole) {
        console.log('Gapped role not found. Initiating auto-setup sequence...');

        // Step 1: Create the Gapped role
        gappedRole = await guild.roles.create({
          name: 'Gapped',
          reason: 'Auto-created by Eiki for the barrier system',
        });

        // Step 3 (Done first so it doesn't overwrite Step 2): Make all channels invisible
        // We loop through every channel and deny the ViewChannel permission for the new role.
        const allChannels = await guild.channels.fetch();
        for (const [id, channel] of allChannels) {
          if (!channel || channel.isThread()) continue; // Threads inherit from parents

          try {
            await channel.permissionOverwrites.create(gappedRole, {
              ViewChannel: false,
            });
          } catch (err) {
            // Silently ignore channels the bot doesn't have access to edit
          }
        }

        // Step 2: Make the barrier channel viewable ONLY by the gapped role
        await barrierChannel.permissionOverwrites.set([
          {
            id: guild.id, // Lock out everyone
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: gappedRole.id, // Let the gapped in
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
            ],
          },
          {
            id: guild.members.me!.id, // Eiki gives herself the master key
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
            ],
          },
        ]);

        // Step 4: Send the sassy confirmation message
        await barrierChannel.send(
          "I just configured the channels to make the gapped work, don't thank me."
        );
      }

      // Finally, add the role to the suspicious new member
      await member.roles.add(gappedRole);
    } else {
      // User is older than 2 months, safe to welcome normally
      // Note: Ensure `welcomeChannel` is actually fetched/defined here before using it
    }

    // 4. Logging Logic
    if (!barrierLoggingChannelId) return;

    const barrierLogChannel = guild.channels.cache.get(
      barrierLoggingChannelId
    ) as TextChannel;
    if (!barrierLogChannel) return;

    const rawMessage =
      '{user} has joined the server, I just gapped his ass hahahah';
    const formattedMessage = rawMessage.replace(
      '{user}',
      member.user.toString()
    );

    await sendMessage(barrierLogChannel, formattedMessage);
  } catch (error) {
    console.error('Error handling join event:', error);
    return;
  }
}
