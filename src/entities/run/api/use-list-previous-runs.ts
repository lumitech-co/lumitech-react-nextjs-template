import { useInfiniteQuery } from '@tanstack/react-query';

import { runsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

const PREVIOUS_RUNS_LIMIT = 20;

export const useListPreviousRuns = () =>
  useInfiniteQuery({
    queryKey: [QueryKeys.RUN_LIST],
    queryFn: ({ pageParam }) =>
      runsApi.listRuns({ limit: PREVIOUS_RUNS_LIMIT, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
  });
