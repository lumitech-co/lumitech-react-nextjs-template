import { useMutation, useQueryClient } from '@tanstack/react-query';

import { reviewFlagsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

export const useReExtractReviewFlag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewFlagsApi.reExtract(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.REVIEW_FLAGS_LIST],
      });
    },
  });
};
