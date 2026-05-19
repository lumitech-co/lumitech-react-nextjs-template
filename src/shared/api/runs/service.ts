import { api } from 'shared/lib';

import {
  ICreateRunRequest,
  ICreateRunResponse,
  IGetLatestRunResponse,
} from './types';

export const runsApi = {
  getLatest: async (): Promise<IGetLatestRunResponse> => {
    const response = await api.get<IGetLatestRunResponse>('/api/runs/latest');

    return response.data;
  },

  createRun: async (data: ICreateRunRequest): Promise<ICreateRunResponse> => {
    const response = await api.post<ICreateRunResponse>('/api/runs', data);

    return response.data;
  },
};
