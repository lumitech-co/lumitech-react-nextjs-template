import { useMutation } from '@tanstack/react-query';

import { runCompaniesApi } from 'shared/api';

export const useRetrievePendingCompanies = () =>
  useMutation({
    mutationFn: (runId: string) => runCompaniesApi.retrievePending(runId),
  });
