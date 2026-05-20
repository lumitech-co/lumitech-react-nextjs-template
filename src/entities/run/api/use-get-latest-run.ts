import { useQuery } from '@tanstack/react-query';

import { IGetLatestRunResponse, runsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

import { getDashboardPollInterval } from '../lib/run-polling';

export const useGetLatestRun = () =>
  useQuery({
    queryKey: [QueryKeys.RUN_LATEST],
    queryFn: () => runsApi.getLatest(),
    refetchInterval: query => {
      const run = query.state.data?.data;

      return getDashboardPollInterval(run?.status);
    },
  });

export const selectLatestRun = (response: IGetLatestRunResponse | undefined) =>
  response?.data ?? null;
