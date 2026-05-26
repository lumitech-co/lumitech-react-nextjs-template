import { useQuery } from '@tanstack/react-query';

import { screeningConfigApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

export const useGetScreeningConfig = () =>
  useQuery({
    queryKey: [QueryKeys.SCREENING_CONFIG],
    queryFn: () => screeningConfigApi.getScreeningConfig(),
  });
