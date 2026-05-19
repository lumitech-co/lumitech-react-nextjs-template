import { useQuery } from '@tanstack/react-query';

import { IListRunCompaniesParams, runCompaniesApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

export const useListRunCompanies = (
  runId: string | null,
  params?: IListRunCompaniesParams,
) =>
  useQuery({
    queryKey: [QueryKeys.RUN_COMPANIES_LIST, runId, params],
    queryFn: () => runCompaniesApi.listCompanies(runId!, params),
    enabled: !!runId,
  });
