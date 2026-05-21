import { useQuery } from '@tanstack/react-query';

import { RunItemStatus, runsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

import { getDashboardPollInterval } from '../lib/run-polling';

export const useGetRunStats = (
  runId: string | undefined,
  runStatus?: RunItemStatus | null,
) =>
  useQuery({
    queryKey: [QueryKeys.RUN_STATS, runId],
    queryFn: () => runsApi.getStats(runId!),
    enabled: !!runId,
    refetchInterval: getDashboardPollInterval(runStatus),
    select: response => response.data,
  });
