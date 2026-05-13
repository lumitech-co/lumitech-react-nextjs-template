import { useMutation } from '@tanstack/react-query';

import { extractionFieldsApi } from 'shared/api';

export const useUpdateConfidenceThreshold = () =>
  useMutation({
    mutationFn: extractionFieldsApi.updateConfidenceThreshold,
  });
