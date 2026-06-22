// src/bot-eiki/events/guildMemberAdd.ts
import { GuildMember, TextChannel } from 'discord.js';
import { api } from '@swissokyo/api-client';
import { sendMessage } from '../utils/messenger';
import { setupGappedSystem } from '../services/barrier';
import { formatAutoGappedLogMessage } from '../utils/formatters';
import { TIME } from '../constants/time';
import { setupYoukaiRole } from '../services/role';

export async function handleJoin(member: GuildMember) {
  if (member.user.bot) return;

  try {
    const guild = member.guild;

    // 1. Get Server Config
    const { success, data } = await api.servers.getById(guild.id);
    const { barrierChannelId, barrierLoggingChannelId } = data;

    if (!barrierChannelId) return;

    console.log(`Barrier channel ID: ${barrierChannelId}`);

    const barrierChannel = guild.channels.cache.get(
      barrierChannelId
    ) as TextChannel;
    if (!barrierChannel) return;

    // 2. Logic: Check Age
    const accountAge = Date.now() - member.user.createdTimestamp;

    console.log(`Account age is ${accountAge}ms`);

    if (accountAge < TIME.TWO_MONTHS_MS) {
      let gappedRole = guild.roles.cache.find((role) => role.name === 'Gapped');
      console.log(
        `We gapping ${member.user.tag} because their account age is ${accountAge}ms`
      );
      // Setup the system if it doesn't exist
      if (!gappedRole) {
        gappedRole = await setupGappedSystem(guild, barrierChannel);
      }

      // Execute the gap
      await member.roles.add(gappedRole);
      console.log(`Added Gapped role to ${member.user.tag}`);
      // Logging
      if (barrierLoggingChannelId) {
        const barrierLogChannel = guild.channels.cache.get(
          barrierLoggingChannelId
        ) as TextChannel;
        if (barrierLogChannel) {
          const logMessage = formatAutoGappedLogMessage(member.user.id);
          await sendMessage(barrierLogChannel, logMessage);
        }
      }
    } else {
      // User is safe, normal welcome
      console.log(`${member.user.tag} is safe to join.`);
      //TODO: turn "isSafe" to true so reimu bot can see it and welcome them properly
      //TODO: Give youkai role so reimu sees it and welcomes them properly
      // Setup the system if it doesn't exist
      let youkaiRole = guild.roles.cache.find((role) => role.name === 'Youkai');
      console.log(`Youkai role: ${youkaiRole ? 'Found' : 'Not found'}`);
      if (!youkaiRole) {
        youkaiRole = await setupYoukaiRole(guild);
      }
      console.log(`Youkai role ID: ${youkaiRole.id}`);
      // Execute the gap
      await member.roles.add(youkaiRole);
      console.log(`Added Youkai role to ${member.user.tag}`);
    }
  } catch (error) {
    //ERROR HANDLING
    console.error('Error handling join event:', error);
    const guild = member.guild;
    const { data } = await api.servers.getById(guild.id);
    const { barrierLoggingChannelId } = data;
    if (barrierLoggingChannelId) {
      const barrierLogChannel = guild.channels.cache.get(
        barrierLoggingChannelId
      ) as TextChannel;
      if (barrierLogChannel) {
        const logMessage =
          'Error occurred while processing a new member. Please check the logs for details.';
        await sendMessage(barrierLogChannel, logMessage);
      }
    }
  }
}
