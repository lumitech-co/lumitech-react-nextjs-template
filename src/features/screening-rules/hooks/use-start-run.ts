import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useCreateRun } from 'entities';

import { IScreeningRules } from 'shared/api';
import { QueryKeys } from 'shared/constants';
import { useToast } from 'shared/ui';

const GBP_PER_BILLION = 1_000_000_000;

export const useStartRun = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const createRunMutation = useCreateRun();

  const startRun = useCallback(
    async (rules: IScreeningRules) => {
      try {
        await createRunMutation.mutateAsync({
          excludedSectors: rules.excludedSectors,
          marketCapThresholdMinGbp: rules.minMcap * GBP_PER_BILLION,
        });
        await queryClient.invalidateQueries({
          queryKey: [QueryKeys.RUN_LATEST],
        });
        toast('Run started · screening in progress', { tone: 'success' });
      } catch {
        toast('Failed to start run', { tone: 'error' });
      }
    },
    [createRunMutation, queryClient, toast],
  );

  return {
    startRun,
    isStarting: createRunMutation.isPending,
  };
};
