import { useInfiniteQuery } from '@tanstack/react-query';

import { RunItemStatus, runsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

import { getDashboardPollInterval } from '../lib/run-polling';

const ACTIVITY_FEED_LIMIT = 8;

export const useGetRunActivities = (
  runId: string | undefined,
  runStatus?: RunItemStatus | null,
) =>
  useInfiniteQuery({
    queryKey: [QueryKeys.RUN_ACTIVITIES, runId],
    queryFn: ({ pageParam }) =>
      runsApi.listActivities(runId!, {
        limit: ACTIVITY_FEED_LIMIT,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    enabled: !!runId,
    refetchInterval: getDashboardPollInterval(runStatus),
  });
