import { api } from 'shared/lib';

import {
  ICreateRunRequest,
  ICreateRunResponse,
  IGetLatestRunResponse,
  IGetRunStatsResponse,
  IListActivitiesParams,
  IListActivitiesResponse,
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

  getStats: async (runId: string): Promise<IGetRunStatsResponse> => {
    const response = await api.get<IGetRunStatsResponse>(
      `/api/runs/${runId}/stats`,
    );

    return response.data;
  },

  listActivities: async (
    runId: string,
    params?: IListActivitiesParams,
  ): Promise<IListActivitiesResponse> => {
    const response = await api.get<IListActivitiesResponse>(
      `/api/runs/${runId}/activities`,
      { params },
    );

    return response.data;
  },
};
