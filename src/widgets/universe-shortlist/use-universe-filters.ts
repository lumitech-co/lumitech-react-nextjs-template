'use client';

import { useCallback, useMemo, useState } from 'react';

import { ICompany } from 'shared/api';

export type FilterKey = 'company' | 'sector' | 'country' | 'mcap' | 'status';

const MCAP_MIN_DEFAULT = 0;
const MCAP_MAX_DEFAULT = 300;

export const statusOf = (company: ICompany): string => {
  if (company.deleted) {
    return 'Deleted';
  }

  if (company.excluded) {
    if (company.excludedReason === 'excluded_sector') {
      return 'Excluded · sector';
    }
    if (company.excludedReason === 'below_threshold') {
      return 'Excluded · market cap';
    }
    if (company.excludedReason === 'manual_override') {
      return 'Manual override';
    }

    return 'Excluded';
  }

  if (company.stage === 'pending_retrieval') {
    return 'Pending Retrieval';
  }

  return 'Passed';
};

export const useUniverseFilters = (companies: ICompany[]) => {
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
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

  const allSectors = useMemo(
    () =>
      Array.from(
        new Set(
          companies
            .filter(company => !company.deleted)
            .map(company => company.sector),
        ),
      ).sort(),
    [companies],
  );

  const allCountries = useMemo(
    () =>
      Array.from(
        new Set(
          companies
            .filter(company => !company.deleted)
            .map(company => company.country),
        ),
      ).sort(),
    [companies],
  );

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
        .map(([key]) => key),
    [filterStatuses],
  );

  const hasMcapFilter =
    filterMcapMin > MCAP_MIN_DEFAULT || filterMcapMax < MCAP_MAX_DEFAULT;

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

  const toggleFilter = useCallback((key: FilterKey) => {
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

  const applyFilters = useCallback(
    (baseList: ICompany[]): ICompany[] =>
      baseList
        .filter(company => !filterManualOnly || company.manuallyAdded)
        .filter(
          company =>
            activeSectors.length === 0 ||
            activeSectors.includes(company.sector),
        )
        .filter(
          company =>
            activeCountries.length === 0 ||
            activeCountries.includes(company.country),
        )
        .filter(
          company =>
            company.mcap >= filterMcapMin && company.mcap <= filterMcapMax,
        )
        .filter(
          company =>
            activeStatuses.length === 0 ||
            activeStatuses.includes(statusOf(company)),
        )
        .sort((companyA, companyB) =>
          companyA.name.localeCompare(companyB.name),
        ),
    [
      filterManualOnly,
      activeSectors,
      activeCountries,
      filterMcapMin,
      filterMcapMax,
      activeStatuses,
    ],
  );

  return {
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
    allSectors,
    allCountries,
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
    applyFilters,
  };
};
