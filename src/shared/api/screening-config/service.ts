import { api } from 'shared/lib';

import {
  IGetScreeningConfigResponse,
  IUpdateScreeningConfigRequest,
  IUpdateScreeningConfigResponse,
} from './types';

export const screeningConfigApi = {
  getScreeningConfig: async (): Promise<IGetScreeningConfigResponse> => {
    const response = await api.get<IGetScreeningConfigResponse>(
      '/api/screening-config',
    );

    return response.data;
  },

  updateScreeningConfig: async (
    data: IUpdateScreeningConfigRequest,
  ): Promise<IUpdateScreeningConfigResponse> => {
    const response = await api.put<IUpdateScreeningConfigResponse>(
      '/api/screening-config',
      data,
    );

    return response.data;
  },
};
