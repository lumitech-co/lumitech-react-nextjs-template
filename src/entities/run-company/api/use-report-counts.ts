import { useQuery } from '@tanstack/react-query';

import { runCompaniesApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

export const useReportCounts = (runId: string | null) =>
  useQuery({
    queryKey: [QueryKeys.RUN_REPORTS_COUNTS, runId],
    queryFn: () => runCompaniesApi.getReportCounts(runId!),
    enabled: !!runId,
  });
