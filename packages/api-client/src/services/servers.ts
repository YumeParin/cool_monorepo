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
  moderatorRoleId: string | null;
  barrierLoggingChannelId: string | null;
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
  edit: (params: {
    discordId: string;
    welcomeChannelId?: string | null;
    barrierChannelId?: string | null;
    barrierLoggingChannelId?: string | null;
    loggingChannelId?: string | null;
    moderatorRoleId?: string | null;
  }) => {
    return apiClient<ApiResponse>('/servers', {
      method: 'PATCH',
      body: JSON.stringify(params),
    });
  },
};
