import { api } from 'shared/lib';

import {
  IListGlobalActivitiesParams,
  IListGlobalActivitiesResponse,
} from './types';

export const activitiesApi = {
  getActivities: async (
    params?: IListGlobalActivitiesParams,
  ): Promise<IListGlobalActivitiesResponse> => {
    const response = await api.get<IListGlobalActivitiesResponse>(
      '/api/activities',
      { params },
    );

    return response.data;
  },
};
