import { useCallback } from 'react';

import { useCreateRun, useRunStore } from 'entities';

import { IScreeningRules } from 'shared/api';
import { useToast } from 'shared/ui';

const GBP_PER_BILLION = 1_000_000_000;

export const useStartRun = () => {
  const toast = useToast();
  const fetchActiveRun = useRunStore(state => state.fetchActiveRun);
  const createRunMutation = useCreateRun();

  const startRun = useCallback(
    async (rules: IScreeningRules) => {
      try {
        await createRunMutation.mutateAsync({
          excludedSectors: rules.excludedSectors,
          marketCapThresholdMinGbp: rules.minMcap * GBP_PER_BILLION,
        });
        await fetchActiveRun();
        toast('Run started · screening in progress', { tone: 'success' });
      } catch {
        toast('Failed to start run', { tone: 'error' });
      }
    },
    [createRunMutation, fetchActiveRun, toast],
  );

  return {
    startRun,
    isStarting: createRunMutation.isPending,
  };
};
