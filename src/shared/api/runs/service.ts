import { api } from 'shared/lib';

import { normalizeRunItem } from './normalize-run-item';
import {
  ICreateRunRequest,
  ICreateRunResponse,
  IGetLatestRunResponse,
  IGetRunStatsResponse,
  IListActivitiesParams,
  IListActivitiesResponse,
  IListRunsParams,
  IListRunsResponse,
} from './types';

export const runsApi = {
  getLatest: async (): Promise<IGetLatestRunResponse> => {
    const response = await api.get<IGetLatestRunResponse>('/api/runs/latest');

    return {
      ...response.data,
      data: response.data.data ? normalizeRunItem(response.data.data) : null,
    };
  },

  createRun: async (data: ICreateRunRequest): Promise<ICreateRunResponse> => {
    const response = await api.post<ICreateRunResponse>('/api/runs', data);

    return {
      data: normalizeRunItem(response.data.data),
    };
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

  listRuns: async (params?: IListRunsParams): Promise<IListRunsResponse> => {
    const response = await api.get<IListRunsResponse>('/api/runs', { params });

    return {
      ...response.data,
      data: response.data.data.map(normalizeRunItem),
    };
  },
};
