import { api } from 'shared/lib';

import {
  IExtractionField,
  IExtractionFieldListParams,
  IExtractionFieldListResponse,
  IUpdateConfidenceThresholdRequest,
  IUpdateConfidenceThresholdResponse,
  IUpdateExtractionFieldRequest,
} from './types';

export const extractionFieldsApi = {
  getExtractionFields: async (
    params?: IExtractionFieldListParams,
  ): Promise<IExtractionFieldListResponse> => {
    const response = await api.get<IExtractionFieldListResponse>(
      '/api/extraction-fields',
      { params },
    );

    return response.data;
  },

  getExtractionFieldById: async (id: string): Promise<IExtractionField> => {
    const response = await api.get<IExtractionField>(
      `/api/extraction-fields/${id}`,
    );

    return response.data;
  },

  updateExtractionField: async (
    id: string,
    data: IUpdateExtractionFieldRequest,
  ): Promise<IExtractionField> => {
    const response = await api.patch<IExtractionField>(
      `/api/extraction-fields/${id}`,
      data,
    );

    return response.data;
  },

  updateConfidenceThreshold: async (
    data: IUpdateConfidenceThresholdRequest,
  ): Promise<IUpdateConfidenceThresholdResponse> => {
    const response = await api.patch<IUpdateConfidenceThresholdResponse>(
      '/api/extraction-fields/confidence-threshold',
      data,
    );

    return response.data;
  },
};
