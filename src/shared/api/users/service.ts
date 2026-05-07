import { api } from 'shared/lib';

import { IUserMeResponse } from './types';

export const usersApi = {
  getMe: async (): Promise<IUserMeResponse> => {
    const response = await api.get<IUserMeResponse>('/api/users/me');

    return response.data;
  },
};
