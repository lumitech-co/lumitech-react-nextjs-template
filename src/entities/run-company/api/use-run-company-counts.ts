import { useQuery } from '@tanstack/react-query';

import { runCompaniesApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

export const useRunCompanyCounts = (runId: string | null) =>
  useQuery({
    queryKey: [QueryKeys.RUN_COMPANIES_COUNTS, runId],
    queryFn: () => runCompaniesApi.getCounts(runId!),
    enabled: !!runId,
  });
