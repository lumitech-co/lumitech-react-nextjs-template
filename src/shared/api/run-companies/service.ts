import { api } from 'shared/lib';

import {
  IAddRunCompanyRequest,
  IAddRunCompanyResponse,
  IListRunCompaniesParams,
  IListRunCompaniesResponse,
  IListRunReportsParams,
  IListRunReportsResponse,
  IMessageResponse,
  IReportCountsResponse,
  IRunCompanyCountsResponse,
  IRunCompanyFilterOptionsResponse,
  ISearchCompanyParams,
  ISearchCompanyResponse,
  IUploadReportResponse,
} from './types';

const buildCompaniesPath = (runId: string) => `/api/runs/${runId}/companies`;

const buildReportsPath = (runId: string) => `/api/runs/${runId}/reports`;

export const runCompaniesApi = {
  listCompanies: async (
    runId: string,
    params?: IListRunCompaniesParams,
  ): Promise<IListRunCompaniesResponse> => {
    const response = await api.get<IListRunCompaniesResponse>(
      buildCompaniesPath(runId),
      { params },
    );

    return response.data;
  },

  getCounts: async (runId: string): Promise<IRunCompanyCountsResponse> => {
    const response = await api.get<IRunCompanyCountsResponse>(
      `${buildCompaniesPath(runId)}/counts`,
    );

    return response.data;
  },

  getFilterOptions: async (
    runId: string,
    params?: IListRunCompaniesParams,
  ): Promise<IRunCompanyFilterOptionsResponse> => {
    const response = await api.get<IRunCompanyFilterOptionsResponse>(
      `${buildCompaniesPath(runId)}/filter-options`,
      { params },
    );

    return response.data;
  },

  searchCompany: async (
    runId: string,
    params: ISearchCompanyParams,
  ): Promise<ISearchCompanyResponse> => {
    const response = await api.get<ISearchCompanyResponse>(
      `${buildCompaniesPath(runId)}/search`,
      { params },
    );

    return response.data;
  },

  exportCompanies: async (runId: string): Promise<Blob> => {
    const response = await api.get<Blob>(
      `${buildCompaniesPath(runId)}/export`,
      {
        responseType: 'blob',
      },
    );

    return response.data;
  },

  addCompany: async (
    runId: string,
    data: IAddRunCompanyRequest,
  ): Promise<IAddRunCompanyResponse> => {
    const response = await api.post<IAddRunCompanyResponse>(
      buildCompaniesPath(runId),
      data,
    );

    return response.data;
  },

  retrievePending: async (runId: string): Promise<IMessageResponse> => {
    const response = await api.post<IMessageResponse>(
      `${buildCompaniesPath(runId)}/retrieve-pending`,
    );

    return response.data;
  },

  deleteCompany: async (
    runId: string,
    runCompanyId: string,
  ): Promise<IMessageResponse> => {
    const response = await api.delete<IMessageResponse>(
      `${buildCompaniesPath(runId)}/${runCompanyId}`,
    );

    return response.data;
  },

  restoreCompany: async (
    runId: string,
    runCompanyId: string,
  ): Promise<IMessageResponse> => {
    const response = await api.patch<IMessageResponse>(
      `${buildCompaniesPath(runId)}/${runCompanyId}/restore`,
    );

    return response.data;
  },

  listReports: async (
    runId: string,
    params?: IListRunReportsParams,
  ): Promise<IListRunReportsResponse> => {
    const response = await api.get<IListRunReportsResponse>(
      buildReportsPath(runId),
      { params },
    );

    return response.data;
  },

  getReportCounts: async (runId: string): Promise<IReportCountsResponse> => {
    const response = await api.get<IReportCountsResponse>(
      `${buildReportsPath(runId)}/counts`,
    );

    return response.data;
  },

  uploadReport: async ({
    runId,
    companyProfileId,
    year,
    file,
  }: {
    runId: string;
    companyProfileId: string;
    year: number;
    file: File;
  }): Promise<IUploadReportResponse> => {
    const formData = new FormData();

    formData.append('year', String(year));
    formData.append('file', file);

    const response = await api.post<IUploadReportResponse>(
      `${buildReportsPath(runId)}/${companyProfileId}/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );

    return response.data;
  },
};
