import { api } from '../index';

export async function isServerAlreadyRegistered(
  guildId: string
): Promise<boolean> {
  try {
    // If this succeeds, the server is in the database.
    await api.servers.getById(guildId);
    return true;
  } catch (error) {
    // If the API throws an error (like a 404 Not Found), it's not registered.
    return false;
  }
}
export const serverUtils = {
  isServerAlreadyRegistered: async (discordId: string) => {
    try {
      // If this succeeds, the server is in the database.
      await api.servers.getById(discordId);
      return true;
    } catch (error) {
      // If the API throws an error (like a 404 Not Found), it's not registered.
      return false;
    }
  },
  getServerModeratorRoleId: async (
    discordId: string
  ): Promise<string | null> => {
    try {
      const response = await api.servers.getById(discordId);
      return response.data.moderatorRoleId;
    } catch (error) {
      console.error(`Error fetching server config for ${discordId}:`, error);
      return null;
    }
  },
  getServerBarrierLoggingChannelId: async (
    discordId: string
  ): Promise<string | null> => {
    try {
      const response = await api.servers.getById(discordId);
      return response.data.barrierLoggingChannelId;
    } catch (error) {
      console.error(`Error fetching server config for ${discordId}:`, error);
      return null;
    }
  },
};
