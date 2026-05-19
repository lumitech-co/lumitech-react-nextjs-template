import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IAddRunCompanyRequest, runCompaniesApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

interface IUseAddRunCompanyParams {
  runId: string;
  data: IAddRunCompanyRequest;
}

export const useAddRunCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ runId, data }: IUseAddRunCompanyParams) =>
      runCompaniesApi.addCompany(runId, data),
    onSuccess: (_response, { runId }) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.RUN_COMPANIES_LIST, runId],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.RUN_COMPANIES_COUNTS, runId],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.RUN_COMPANIES_FILTER_OPTIONS, runId],
      });
    },
  });
};
