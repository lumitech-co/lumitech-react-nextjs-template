import { useMutation, useQueryClient } from '@tanstack/react-query';

import { screeningConfigApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

export const useUpdateScreeningConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: screeningConfigApi.updateScreeningConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.SCREENING_CONFIG],
      });
    },
  });
};
