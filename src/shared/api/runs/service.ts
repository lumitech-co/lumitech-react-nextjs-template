import { api } from 'shared/lib';

import { IGetLatestRunResponse } from './types';

export const runsApi = {
  getLatest: async (): Promise<IGetLatestRunResponse> => {
    const response = await api.get<IGetLatestRunResponse>('/api/runs/latest');

    return response.data;
  },
};
