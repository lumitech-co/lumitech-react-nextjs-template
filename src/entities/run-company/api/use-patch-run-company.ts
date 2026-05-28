import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IPatchRunCompanyRequest, runCompaniesApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

interface IPatchRunCompanyParams {
  runId: string;
  runCompanyId: string;
  data: IPatchRunCompanyRequest;
}

export const usePatchRunCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ runId, runCompanyId, data }: IPatchRunCompanyParams) =>
      runCompaniesApi.patchRunCompany(runId, runCompanyId, data),
    onSuccess: (_response, { runId }) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.RUN_REPORTS_LIST, runId],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.RUN_COMPANIES_LIST, runId],
      });
    },
  });
};
