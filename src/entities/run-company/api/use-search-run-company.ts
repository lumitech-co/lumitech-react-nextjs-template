import { useMutation } from '@tanstack/react-query';

import { ISearchCompanyParams, runCompaniesApi } from 'shared/api';

interface ISearchRunCompanyParams {
  runId: string;
  params: ISearchCompanyParams;
}

export const useSearchRunCompany = () =>
  useMutation({
    mutationFn: ({ runId, params }: ISearchRunCompanyParams) =>
      runCompaniesApi.searchCompany(runId, params),
  });
