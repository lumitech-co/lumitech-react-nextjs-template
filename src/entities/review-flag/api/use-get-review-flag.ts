import { useQuery } from '@tanstack/react-query';

import { reviewFlagsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

export const useGetReviewFlag = (id: string | undefined) =>
  useQuery({
    queryKey: [QueryKeys.REVIEW_FLAG_DETAIL, id],
    queryFn: () => reviewFlagsApi.getById(id!),
    enabled: !!id,
  });
