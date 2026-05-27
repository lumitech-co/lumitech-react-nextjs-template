import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IManualInputRequest, reviewFlagsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

interface Variables {
  id: string;
  resolvedValue: number;
}

export const useManualInputReviewFlag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, resolvedValue }: Variables) => {
      const data: IManualInputRequest = { resolvedValue };

      return reviewFlagsApi.manualInput(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.REVIEW_FLAGS_LIST],
      });
    },
  });
};
