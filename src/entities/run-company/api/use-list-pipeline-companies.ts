import { useInfiniteQuery } from '@tanstack/react-query';

import { runCompaniesApi, RunItemStatus } from 'shared/api';
import { QueryKeys } from 'shared/constants';

import { getDashboardPollInterval } from '../../run/lib/run-polling';

const PIPELINE_COMPANIES_LIMIT = 8;

export const useListPipelineCompanies = (
  runId: string | undefined,
  runStatus?: RunItemStatus | null,
) =>
  useInfiniteQuery({
    queryKey: [QueryKeys.RUN_PIPELINE_COMPANIES, runId],
    queryFn: ({ pageParam }) =>
      runCompaniesApi.listPipelineCompanies(runId!, {
        limit: PIPELINE_COMPANIES_LIMIT,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    enabled: !!runId,
    refetchInterval: getDashboardPollInterval(runStatus),
  });
