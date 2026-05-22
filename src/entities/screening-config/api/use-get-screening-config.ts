import { useQuery } from '@tanstack/react-query';

import { DEFAULT_SCREENING, screeningConfigApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { GBP_PER_BILLION } from 'shared/lib';

const screeningConfigPlaceholder = {
  message: '',
  data: {
    excludedSectors: DEFAULT_SCREENING.excludedSectors.map(String),
    marketCapThresholdMinGbp:
      (DEFAULT_SCREENING.minMcap ?? 0) * GBP_PER_BILLION,
    updatedAt: new Date(0).toISOString(),
  },
};

export const useGetScreeningConfig = () =>
  useQuery({
    queryKey: [QueryKeys.SCREENING_CONFIG],
    queryFn: () => screeningConfigApi.getScreeningConfig(),
    placeholderData: screeningConfigPlaceholder,
  });
