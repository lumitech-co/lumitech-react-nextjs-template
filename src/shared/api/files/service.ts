import { api } from 'shared/lib';

import { IGetSignedUrlResponse } from './types';

export const filesApi = {
  getSignedUrl: async (filePath: string): Promise<IGetSignedUrlResponse> => {
    const response = await api.get<IGetSignedUrlResponse>(
      `/api/files/${filePath}`,
    );

    return response.data;
  },
};
