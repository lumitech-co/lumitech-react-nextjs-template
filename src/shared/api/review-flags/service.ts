import { api } from 'shared/lib';

import {
  IListReviewFlagsParams,
  IListReviewFlagsResponse,
  IManualInputRequest,
  IReviewFlagDetail,
} from './types';

export const reviewFlagsApi = {
  list: async (
    params: IListReviewFlagsParams,
  ): Promise<IListReviewFlagsResponse> => {
    const response = await api.get<IListReviewFlagsResponse>(
      '/api/review-flags',
      { params },
    );

    return response.data;
  },

  getById: async (id: string): Promise<IReviewFlagDetail> => {
    const response = await api.get<IReviewFlagDetail>(
      `/api/review-flags/${id}`,
    );

    return response.data;
  },

  accept: async (id: string): Promise<void> => {
    await api.patch(`/api/review-flags/${id}/accept`);
  },

  manualInput: async (id: string, data: IManualInputRequest): Promise<void> => {
    await api.patch(`/api/review-flags/${id}/manual-input`, data);
  },

  reExtract: async (id: string): Promise<void> => {
    await api.post(`/api/review-flags/${id}/re-extract`);
  },
};
