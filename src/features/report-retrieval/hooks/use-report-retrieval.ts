'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  useListRunReports,
  useReportCounts,
  useRunStore,
  useUploadReport,
} from 'entities';

import { CompanyReportTab, IReportCompanyItem } from 'shared/api';
import { useToast } from 'shared/ui';

const WINDOW_SIZE = 3;
const LIST_LIMIT = 200;
const MAX_YEAR_WINDOW_OFFSET = 5;

type ReportFilter = 'all' | 'issues' | 'not_published' | 'manual';

const FILTER_TAB_MAP: Record<ReportFilter, CompanyReportTab> = {
  all: CompanyReportTab.All,
  issues: CompanyReportTab.NotRetrieved,
  not_published: CompanyReportTab.NotPublished,
  manual: CompanyReportTab.ManualUploads,
};

export const useReportRetrieval = () => {
  const toast = useToast();
  const activeRun = useRunStore(state => state.activeRun);
  const runId = activeRun?.id ?? null;

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ReportFilter>('all');
  const [windowStart, setWindowStart] = useState(0);

  const currentYear = useMemo(() => new Date().getFullYear() - 1, []);
  const defaultFromYear = currentYear - (WINDOW_SIZE - 1);

  const listParams = useMemo(
    () => ({
      tab: FILTER_TAB_MAP[filter],
      search: query.trim() || undefined,
      limit: LIST_LIMIT,
      fromYear: defaultFromYear - windowStart,
      toYear: currentYear - windowStart,
    }),
    [filter, query, defaultFromYear, windowStart, currentYear],
  );

  const { data: reportsData, isLoading: isReportsLoading } = useListRunReports(
    runId,
    listParams,
  );

  const { data: counts } = useReportCounts(runId);
  const uploadMutation = useUploadReport();

  const companies = reportsData?.data ?? [];

  const visibleYears = useMemo(() => {
    const years: number[] = [];

    for (
      let year = listParams.toYear ?? currentYear;
      year >= (listParams.fromYear ?? defaultFromYear);
      year -= 1
    ) {
      years.push(year);
    }

    return years;
  }, [listParams.fromYear, listParams.toYear, currentYear, defaultFromYear]);

  const canGoOlder = windowStart < MAX_YEAR_WINDOW_OFFSET;
  const canGoNewer = windowStart > 0;

  const uploadReport = useCallback(
    async (
      company: IReportCompanyItem,
      year: number,
      file: File,
    ): Promise<boolean> => {
      if (!runId) {
        return false;
      }

      try {
        await uploadMutation.mutateAsync({
          runId,
          companyProfileId: company.companyProfile.id,
          year,
          file,
        });
        toast('Report uploaded · queued for parsing', { tone: 'success' });

        return true;
      } catch {
        toast('Failed to upload report', { tone: 'error' });

        return false;
      }
    },
    [runId, uploadMutation, toast],
  );

  return {
    runId,
    activeRun,
    query,
    setQuery,
    filter,
    setFilter,
    companies,
    isReportsLoading,
    counts,
    visibleYears,
    windowStart,
    setWindowStart,
    canGoOlder,
    canGoNewer,
    uploadReport,
    isUploading: uploadMutation.isPending,
  };
};
