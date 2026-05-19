import { useMutation, useQueryClient } from '@tanstack/react-query';

import { runCompaniesApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

interface IUseUploadReportParams {
  runId: string;
  companyProfileId: string;
  year: number;
  file: File;
}

export const useUploadReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: IUseUploadReportParams) =>
      runCompaniesApi.uploadReport(params),
    onSuccess: (_response, { runId }) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.RUN_REPORTS_LIST, runId],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.RUN_REPORTS_COUNTS, runId],
      });
    },
  });
};
