import { useInfiniteQuery } from '@tanstack/react-query';

import { IListReviewFlagsParams, reviewFlagsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

type Params = Omit<IListReviewFlagsParams, 'cursor'>;

export const useListReviewFlags = (params: Params) =>
  useInfiniteQuery({
    queryKey: [QueryKeys.REVIEW_FLAGS_LIST, params.runId, params.tab],
    queryFn: ({ pageParam }) =>
      reviewFlagsApi.list({
        ...params,
        cursor: pageParam as string | undefined,
        limit: 50,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    enabled: !!params.runId,
  });
