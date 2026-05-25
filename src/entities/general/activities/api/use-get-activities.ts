import { useInfiniteQuery } from '@tanstack/react-query';

import { activitiesApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

const ACTIVITY_FEED_LIMIT = 8;
const ACTIVITY_POLL_INTERVAL_MS = 60_000;

export const useGetActivities = () =>
  useInfiniteQuery({
    queryKey: [QueryKeys.GLOBAL_ACTIVITIES],
    queryFn: ({ pageParam }) =>
      activitiesApi.getActivities({
        limit: ACTIVITY_FEED_LIMIT,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    refetchInterval: ACTIVITY_POLL_INTERVAL_MS,
  });
