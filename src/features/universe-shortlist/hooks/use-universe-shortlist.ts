'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  useAddRunCompany,
  useDeleteRunCompany,
  useGetLatestRun,
  useListRunCompanies,
  useRestoreRunCompany,
  useRetrievePendingCompanies,
  useRunCompanyCounts,
  useRunCompanyFilterOptions,
  useSearchRunCompany,
} from 'entities';

import {
  CompanyTab,
  IAddRunCompanyRequest,
  IListRunCompaniesParams,
  runCompaniesApi,
  RunCompanyStatus,
} from 'shared/api';
import { useDebounce } from 'shared/lib';
import { useToast } from 'shared/ui';

const GBP_PER_BILLION = 1_000_000_000;

export type UniverseFilterKey =
  | 'company'
  | 'sector'
  | 'country'
  | 'mcap'
  | 'status';
const MCAP_MIN_DEFAULT = 0;
const MCAP_MAX_DEFAULT = 300;
const LIST_LIMIT = 200;

type UniverseTab = 'shortlist' | 'excluded' | 'all' | 'deleted';

const TAB_MAP: Record<UniverseTab, CompanyTab> = {
  shortlist: CompanyTab.Shortlist,
  excluded: CompanyTab.Excluded,
  all: CompanyTab.All,
  deleted: CompanyTab.Deleted,
};

export const useUniverseShortlist = () => {
  const toast = useToast();
  const { data: latestRunResponse } = useGetLatestRun();
  const activeRun = latestRunResponse?.data ?? null;
  const runId = activeRun?.id ?? null;

  const [tab, setTab] = useState<UniverseTab>('shortlist');
  const [search, setSearch] = useState('');
  const [openFilter, setOpenFilter] = useState<UniverseFilterKey | null>(null);
  const [filterManualOnly, setFilterManualOnly] = useState(false);
  const [filterSectors, setFilterSectors] = useState<Record<string, boolean>>(
    {},
  );
  const [filterCountries, setFilterCountries] = useState<
    Record<string, boolean>
  >({});
  const [filterMcapMin, setFilterMcapMin] = useState(MCAP_MIN_DEFAULT);
  const [filterMcapMax, setFilterMcapMax] = useState(MCAP_MAX_DEFAULT);
  const [filterStatuses, setFilterStatuses] = useState<Record<string, boolean>>(
    {},
  );

  const debouncedSearch = useDebounce(search);
  const debouncedMcapMin = useDebounce(filterMcapMin);
  const debouncedMcapMax = useDebounce(filterMcapMax);

  const activeSectors = useMemo(
    () =>
      Object.entries(filterSectors)
        .filter(([, active]) => active)
        .map(([key]) => key),
    [filterSectors],
  );

  const activeCountries = useMemo(
    () =>
      Object.entries(filterCountries)
        .filter(([, active]) => active)
        .map(([key]) => key),
    [filterCountries],
  );

  const activeStatuses = useMemo(
    () =>
      Object.entries(filterStatuses)
        .filter(([, active]) => active)
        .map(([key]) => key as RunCompanyStatus),
    [filterStatuses],
  );

  const hasMcapFilter =
    filterMcapMin > MCAP_MIN_DEFAULT || filterMcapMax < MCAP_MAX_DEFAULT;

  const listParams = useMemo((): IListRunCompaniesParams | undefined => {
    if (!runId) {
      return undefined;
    }

    return {
      tab: TAB_MAP[tab],
      search: debouncedSearch.trim() || undefined,
      limit: LIST_LIMIT,
      isManuallyAdded: filterManualOnly || undefined,
      supersectors: activeSectors.length > 0 ? activeSectors : undefined,
      countries: activeCountries.length > 0 ? activeCountries : undefined,
      marketCapMin:
        debouncedMcapMin > MCAP_MIN_DEFAULT
          ? debouncedMcapMin * GBP_PER_BILLION
          : undefined,
      marketCapMax:
        debouncedMcapMax < MCAP_MAX_DEFAULT
          ? debouncedMcapMax * GBP_PER_BILLION
          : undefined,
      statuses: activeStatuses.length > 0 ? activeStatuses : undefined,
    };
  }, [
    runId,
    tab,
    debouncedSearch,
    filterManualOnly,
    activeSectors,
    activeCountries,
    debouncedMcapMin,
    debouncedMcapMax,
    activeStatuses,
  ]);

  const filterOptionsParams = useMemo(():
    | IListRunCompaniesParams
    | undefined => {
    if (!runId) {
      return undefined;
    }

    return {
      tab: TAB_MAP[tab],
      isManuallyAdded: filterManualOnly || undefined,
      supersectors: activeSectors.length > 0 ? activeSectors : undefined,
      countries: activeCountries.length > 0 ? activeCountries : undefined,
      marketCapMin:
        debouncedMcapMin > MCAP_MIN_DEFAULT
          ? debouncedMcapMin * GBP_PER_BILLION
          : undefined,
      marketCapMax:
        debouncedMcapMax < MCAP_MAX_DEFAULT
          ? debouncedMcapMax * GBP_PER_BILLION
          : undefined,
      statuses: activeStatuses.length > 0 ? activeStatuses : undefined,
    };
  }, [
    runId,
    tab,
    filterManualOnly,
    activeSectors,
    activeCountries,
    debouncedMcapMin,
    debouncedMcapMax,
    activeStatuses,
  ]);

  const { data: companiesData, isLoading: isCompaniesLoading } =
    useListRunCompanies(runId, listParams);

  const { data: counts } = useRunCompanyCounts(runId);

  const { data: filterOptions } = useRunCompanyFilterOptions(
    runId,
    filterOptionsParams,
  );

  const deleteMutation = useDeleteRunCompany();
  const restoreMutation = useRestoreRunCompany();
  const addMutation = useAddRunCompany();
  const retrievePendingMutation = useRetrievePendingCompanies();
  const searchMutation = useSearchRunCompany();

  const companies = companiesData?.data ?? [];
  const total = companiesData?.total ?? 0;

  const activeFilterCount =
    (filterManualOnly ? 1 : 0) +
    activeSectors.length +
    activeCountries.length +
    (hasMcapFilter ? 1 : 0) +
    activeStatuses.length;

  const clearAllFilters = useCallback(() => {
    setFilterManualOnly(false);
    setFilterSectors({});
    setFilterCountries({});
    setFilterMcapMin(MCAP_MIN_DEFAULT);
    setFilterMcapMax(MCAP_MAX_DEFAULT);
    setFilterStatuses({});
  }, []);

  const toggleFilter = useCallback((key: UniverseFilterKey) => {
    setOpenFilter(prev => (prev === key ? null : key));
  }, []);

  const closeFilter = useCallback(() => {
    setOpenFilter(null);
  }, []);

  const toggleSector = useCallback((sector: string, checked: boolean) => {
    setFilterSectors(prev => ({ ...prev, [sector]: checked }));
  }, []);

  const toggleCountry = useCallback((country: string, checked: boolean) => {
    setFilterCountries(prev => ({ ...prev, [country]: checked }));
  }, []);

  const toggleStatus = useCallback((status: string, checked: boolean) => {
    setFilterStatuses(prev => ({ ...prev, [status]: checked }));
  }, []);

  const removeCompany = useCallback(
    async (runCompanyId: string) => {
      if (!runId) {
        return;
      }

      try {
        await deleteMutation.mutateAsync({ runId, runCompanyId });
        toast('Company moved to Deleted · use Restore to bring it back');
      } catch {
        toast('Failed to remove company', { tone: 'error' });
      }
    },
    [runId, deleteMutation, toast],
  );

  const restoreCompany = useCallback(
    async (runCompanyId: string) => {
      if (!runId) {
        return;
      }

      try {
        await restoreMutation.mutateAsync({ runId, runCompanyId });
        toast('Company restored', { tone: 'success' });
      } catch {
        toast('Failed to restore company', { tone: 'error' });
      }
    },
    [runId, restoreMutation, toast],
  );

  const exportCsv = useCallback(async () => {
    if (!runId) {
      return;
    }

    try {
      const blob = await runCompaniesApi.exportCompanies(runId);
      const ISO_DATE_LENGTH = 10;
      const isoDate = new Date().toISOString();
      const dateLabel = isoDate.slice(0, ISO_DATE_LENGTH);
      const url = URL.createObjectURL(blob);

      try {
        const link = document.createElement('a');

        link.href = url;
        link.download = `shortlist-${dateLabel}.csv`;
        link.click();
      } finally {
        URL.revokeObjectURL(url);
      }

      toast('CSV exported', { tone: 'success' });
    } catch {
      toast('Failed to export CSV', { tone: 'error' });
    }
  }, [runId, toast]);

  const retrievePending = useCallback(async () => {
    if (!runId) {
      return;
    }

    const pendingCount = counts?.pendingRetrieval ?? 0;

    try {
      await retrievePendingMutation.mutateAsync(runId);
      toast(
        `Retrieval queued for ${pendingCount} manually added compan${pendingCount === 1 ? 'y' : 'ies'}`,
        { tone: 'success' },
      );
    } catch {
      toast('Failed to queue retrieval', { tone: 'error' });
    }
  }, [runId, counts?.pendingRetrieval, retrievePendingMutation, toast]);

  const addCompany = useCallback(
    async (data: IAddRunCompanyRequest) => {
      if (!runId) {
        return;
      }

      try {
        await addMutation.mutateAsync({ runId, data });
        toast('Company added to shortlist', { tone: 'success' });
      } catch {
        toast('Failed to add company', { tone: 'error' });
        throw new Error('Failed to add company');
      }
    },
    [runId, addMutation, toast],
  );

  const searchCompany = useCallback(
    async (name: string, domain: string) => {
      if (!runId) {
        return null;
      }

      try {
        const response = await searchMutation.mutateAsync({
          runId,
          params: { name, domain },
        });

        return response.data;
      } catch {
        return null;
      }
    },
    [runId, searchMutation],
  );

  return {
    runId,
    activeRun,
    tab,
    setTab,
    search,
    setSearch,
    companies,
    total,
    isCompaniesLoading,
    counts,
    pendingRetrieval: counts?.pendingRetrieval ?? 0,
    filterOptions,
    openFilter,
    filterManualOnly,
    setFilterManualOnly,
    filterSectors,
    filterCountries,
    filterMcapMin,
    setFilterMcapMin,
    filterMcapMax,
    setFilterMcapMax,
    filterStatuses,
    activeSectors,
    activeCountries,
    activeStatuses,
    hasMcapFilter,
    activeFilterCount,
    clearAllFilters,
    toggleFilter,
    closeFilter,
    toggleSector,
    toggleCountry,
    toggleStatus,
    removeCompany,
    restoreCompany,
    exportCsv,
    retrievePending,
    addCompany,
    searchCompany,
    isAdding: addMutation.isPending,
    isSearching: searchMutation.isPending,
  };
};
