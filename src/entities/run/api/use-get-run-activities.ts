import { useQuery } from '@tanstack/react-query';

import { RunItemStatus, runsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

import { getDashboardPollInterval } from '../lib/run-polling';

const ACTIVITY_FEED_LIMIT = 20;

export const useGetRunActivities = (
  runId: string | undefined,
  runStatus?: RunItemStatus | null,
) =>
  useQuery({
    queryKey: [QueryKeys.RUN_ACTIVITIES, runId],
    queryFn: () =>
      runsApi.listActivities(runId!, { limit: ACTIVITY_FEED_LIMIT }),
    enabled: !!runId,
    refetchInterval: getDashboardPollInterval(runStatus),
    select: response => response.data,
  });
