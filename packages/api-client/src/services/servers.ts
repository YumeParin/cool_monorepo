import { apiClient } from '../client';

export interface ApiResponse {
  success: boolean;
  data: ServerResponse;
}
export interface ServerResponse {
  id: string;
  discordId: string;
  welcomeChannelId: string | null;
  barrierChannelId: string | null;
  loggingChannelId: string | null;
  createdAt: string;
}

export const serverApi = {
  create: (discordId: string) => {
    return apiClient<ApiResponse>('/servers', {
      method: 'POST',
      body: JSON.stringify({ discordId }),
    });
  },

  getList: () => {
    return apiClient<ApiResponse[]>(`/servers`, {
      method: 'GET',
    });
  },
  getById: (discordId: string) => {
    return apiClient<ApiResponse>(`/servers/${discordId}`, {
      method: 'GET',
    });
  },
  edit: (
    discordId: string,
    welcomeChannelId?: string | null,
    barrierChannelId?: string | null,
    barrierLoggingChannelId?: string | null,
    loggingChannelId?: string | null
  ) => {
    return apiClient<ApiResponse>('/servers', {
      method: 'PATCH',
      body: JSON.stringify({
        discordId: discordId,
        welcomeChannelId,
        barrierChannelId,
        barrierLoggingChannelId,
        loggingChannelId,
      }),
    });
  },
};
