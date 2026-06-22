import { Guild, TextChannel, PermissionFlagsBits, Role } from 'discord.js';

export async function setupGappedSystem(
  guild: Guild,
  barrierChannel: TextChannel
): Promise<Role> {
  console.log('Gapped role not found. Initiating auto-setup sequence...');

  // Step 1: Create the Gapped role
  const gappedRole = await guild.roles.create({
    name: 'Gapped',
    reason: 'Auto-created by Eiki for the barrier system',
  });

  // Step 2: Make all channels invisible
  const allChannels = await guild.channels.fetch();
  for (const [id, channel] of allChannels) {
    if (!channel || channel.isThread()) continue;

    try {
      await channel.permissionOverwrites.create(gappedRole, {
        ViewChannel: false,
      });
    } catch (err) {
      // Silently ignore channels the bot doesn't have access to edit
    }
  }

  // Step 3: Make the barrier channel viewable ONLY by the gapped role
  await barrierChannel.permissionOverwrites.set([
    {
      id: guild.id,
      deny: [PermissionFlagsBits.ViewChannel],
    },
    {
      id: gappedRole.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
      ],
    },
    {
      id: guild.members.me!.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
      ],
    },
  ]);

  // Step 4: Sassy confirmation
  await barrierChannel.send(
    "I just configured the channels to make the gapped work, don't thank me."
  );

  return gappedRole;
}
