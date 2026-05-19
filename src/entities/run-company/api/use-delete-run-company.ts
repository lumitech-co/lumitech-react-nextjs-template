import { useMutation, useQueryClient } from '@tanstack/react-query';

import { runCompaniesApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

interface IUseDeleteRunCompanyParams {
  runId: string;
  runCompanyId: string;
}

export const useDeleteRunCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ runId, runCompanyId }: IUseDeleteRunCompanyParams) =>
      runCompaniesApi.deleteCompany(runId, runCompanyId),
    onSuccess: (_response, { runId }) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.RUN_COMPANIES_LIST, runId],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.RUN_COMPANIES_COUNTS, runId],
      });
    },
  });
};
