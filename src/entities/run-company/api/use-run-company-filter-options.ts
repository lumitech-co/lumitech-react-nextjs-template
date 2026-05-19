import { useQuery } from '@tanstack/react-query';

import { IListRunCompaniesParams, runCompaniesApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

export const useRunCompanyFilterOptions = (
  runId: string | null,
  params?: IListRunCompaniesParams,
) =>
  useQuery({
    queryKey: [QueryKeys.RUN_COMPANIES_FILTER_OPTIONS, runId, params],
    queryFn: () => runCompaniesApi.getFilterOptions(runId!, params),
    enabled: !!runId,
  });
