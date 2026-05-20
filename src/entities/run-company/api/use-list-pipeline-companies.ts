import { useQuery } from '@tanstack/react-query';

import { runCompaniesApi, RunItemStatus } from 'shared/api';
import { QueryKeys } from 'shared/constants';

import { getDashboardPollInterval } from '../../run/lib/run-polling';

const PIPELINE_COMPANIES_LIMIT = 50;

export const useListPipelineCompanies = (
  runId: string | undefined,
  runStatus?: RunItemStatus | null,
) =>
  useQuery({
    queryKey: [QueryKeys.RUN_PIPELINE_COMPANIES, runId],
    queryFn: () =>
      runCompaniesApi.listPipelineCompanies(runId!, {
        limit: PIPELINE_COMPANIES_LIMIT,
      }),
    enabled: !!runId,
    refetchInterval: getDashboardPollInterval(runStatus),
    select: response => response.data,
  });
