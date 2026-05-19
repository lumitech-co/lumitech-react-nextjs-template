import { useQuery } from '@tanstack/react-query';

import { IListRunReportsParams, runCompaniesApi } from 'shared/api';
import { QueryKeys } from 'shared/constants';

export const useListRunReports = (
  runId: string | null,
  params?: IListRunReportsParams,
) =>
  useQuery({
    queryKey: [QueryKeys.RUN_REPORTS_LIST, runId, params],
    queryFn: () => runCompaniesApi.listReports(runId!, params),
    enabled: !!runId,
  });
