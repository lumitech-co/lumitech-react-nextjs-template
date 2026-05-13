import { useCallback, useState } from 'react';

import { useUpdateConfidenceThreshold } from 'entities';

import { useToast } from 'shared/ui';

const DEFAULT_THRESHOLD = 90;

export const useConfidenceThreshold = () => {
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const updateMutation = useUpdateConfidenceThreshold();
  const toast = useToast();

  const saveThreshold = useCallback(async () => {
    await updateMutation.mutateAsync({ threshold });
    toast('Threshold updated', { tone: 'success' });
  }, [threshold, updateMutation, toast]);

  return {
    threshold,
    setThreshold,
    saveThreshold,
    isSaving: updateMutation.isPending,
  };
};
