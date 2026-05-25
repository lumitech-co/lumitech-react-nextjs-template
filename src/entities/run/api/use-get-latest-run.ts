import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { IGetLatestRunResponse, runsApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

import { getDashboardPollInterval } from '../lib/run-polling';

export const useGetLatestRun = () =>
  useQuery({
    queryKey: [QueryKeys.RUN_LATEST],
    queryFn: async () => {
      try {
        return await runsApi.getLatest();
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null;
        }

        throw error;
      }
    },
    refetchInterval: query => {
      const run = query.state.data?.data;

      return getDashboardPollInterval(run?.status);
    },
  });

export const selectLatestRun = (response: IGetLatestRunResponse | undefined) =>
  response?.data ?? null;
