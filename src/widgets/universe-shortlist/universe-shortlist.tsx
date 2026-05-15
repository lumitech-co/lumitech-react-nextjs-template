'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import { ICompany, MOCK_COMPANIES } from 'shared/api';
import {
  CloudIcon,
  DownloadIcon,
  FilterIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  TrashIcon,
} from 'shared/icons';
import { cn } from 'shared/lib';
import { Badge, Checkbox, useToast } from 'shared/ui';

import { AddCompanyModal } from './add-company-modal';
import { FilterDropdownPortal } from './filter-dropdown-portal';
import { statusOf, useUniverseFilters } from './use-universe-filters';

type Tab = 'shortlist' | 'excluded' | 'all' | 'deleted';

const INITIALS_LENGTH = 2;
const RIC_NAME_LENGTH = 4;
const TABLE_MIN_HEIGHT = 200;
const TABLE_COL_SPAN = 7;

const RIC_EXCHANGE_MAP: Record<string, string> = {
  UK: 'L',
  DE: 'DE',
  FR: 'PA',
  CH: 'S',
  NL: 'AS',
  ES: 'MC',
  IT: 'MI',
  SE: 'ST',
  DK: 'CO',
  FI: 'HE',
  NO: 'OL',
  BE: 'BR',
  IE: 'I',
  PT: 'LS',
  AT: 'VI',
  US: 'N',
  TW: 'TW',
};

const deriveRic = (name: string, country: string): string => {
  const code = name
    .replace(/[^A-Za-z]/g, '')
    .slice(0, RIC_NAME_LENGTH)
    .toUpperCase();
  const exchange = RIC_EXCHANGE_MAP[country] || country;

  return `${code}.${exchange}`;
};

const getStatusBadge = (company: ICompany) => {
  if (company.deleted) {
    return <Badge tone="neutral">Deleted</Badge>;
  }

  if (company.excluded) {
    if (company.excludedReason === 'excluded_sector') {
      return <Badge tone="danger">Excluded &middot; sector</Badge>;
    }

    if (company.excludedReason === 'below_threshold') {
      return <Badge tone="danger">Excluded &middot; market cap</Badge>;
    }

    if (company.excludedReason === 'manual_override') {
      return <Badge tone="danger">Manual override</Badge>;
    }

    return <Badge tone="danger">Excluded</Badge>;
  }

  if (company.stage === 'pending_retrieval') {
    return <Badge tone="warning">Pending Retrieval</Badge>;
  }

  return <Badge tone="success">Passed</Badge>;
};

export const UniverseShortlist = () => {
  const [tab, setTab] = useState<Tab>('shortlist');
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [companies, setCompanies] = useState<ICompany[]>(MOCK_COMPANIES);
  const toast = useToast();

  const filters = useUniverseFilters(companies);

  // One ref per filter button — passed to the portal for getBoundingClientRect positioning
  const companyFilterRef = useRef<HTMLButtonElement>(null);
  const sectorFilterRef = useRef<HTMLButtonElement>(null);
  const countryFilterRef = useRef<HTMLButtonElement>(null);
  const mcapFilterRef = useRef<HTMLButtonElement>(null);
  const statusFilterRef = useRef<HTMLButtonElement>(null);

  const shortlisted = useMemo(
    () => companies.filter(company => !company.excluded && !company.deleted),
    [companies],
  );
  const excluded = useMemo(
    () => companies.filter(company => company.excluded && !company.deleted),
    [companies],
  );
  const deletedList = useMemo(
    () => companies.filter(company => company.deleted),
    [companies],
  );

  const getBaseList = (): ICompany[] => {
    if (tab === 'shortlist') {
      return shortlisted;
    }

    if (tab === 'excluded') {
      return excluded;
    }

    if (tab === 'deleted') {
      return deletedList;
    }

    return companies;
  };

  const baseList = getBaseList();

  const searchedList = useMemo(() => {
    if (!query) {
      return baseList;
    }

    const lowerQuery = query.toLowerCase();

    return baseList.filter(company =>
      company.name.toLowerCase().includes(lowerQuery),
    );
  }, [baseList, query]);

  const list = filters.applyFilters(searchedList);

  const availableStatuses = useMemo(
    () => Array.from(new Set(baseList.map(statusOf))).sort(),
    [baseList],
  );

  const pendingCount = useMemo(
    () =>
      shortlisted.filter(
        company =>
          company.manuallyAdded && company.stage === 'pending_retrieval',
      ).length,
    [shortlisted],
  );

  const removeCo = useCallback(
    (companyId: string) => {
      setCompanies(prev =>
        prev.map(company =>
          company.id === companyId ? { ...company, deleted: true } : company,
        ),
      );
      toast('Company moved to Deleted \u00B7 use Restore to bring it back');
    },
    [toast],
  );

  const restoreCo = useCallback(
    (companyId: string) => {
      setCompanies(prev =>
        prev.map(company =>
          company.id === companyId ? { ...company, deleted: false } : company,
        ),
      );
      toast('Company restored', { tone: 'success' });
    },
    [toast],
  );

  const exportCsv = useCallback(() => {
    toast('CSV exported \u00B7 shortlist-2026-04-30.csv', { tone: 'success' });
  }, [toast]);

  const handleAdd = useCallback(
    (found: {
      name: string;
      website: string;
      sector: string;
      country: string;
      mcap: number;
      weight: number;
    }) => {
      const newCompany: ICompany = {
        ...found,
        id: `co-m-${Date.now()}`,
        manuallyAdded: true,
        excluded: false,
        excludedReason: null,
        stage: 'screening',
        conviction: null,
        sourceListing: 'Manual',
        reports: [],
      };

      setCompanies(prev => [newCompany, ...prev]);
      toast('Company added to shortlist', { tone: 'success' });
    },
    [toast],
  );

  return (
    <div className="content">
      <div className="page-header between">
        <div>
          <div className="page-title">Universe &amp; Shortlist</div>
          <div className="page-sub">
            Loaded from STOXX 600 official source &middot; Apr 30, 2026 &middot;
            600 companies in universe (plus manually added)
          </div>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowAdd(true)}
          >
            <PlusIcon width={13} height={13} />
            Add Company
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={exportCsv}
          >
            <DownloadIcon width={13} height={13} />
            Export CSV
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={pendingCount === 0}
            onClick={() =>
              toast(
                `Retrieval queued for ${pendingCount} manually added compan${pendingCount === 1 ? 'y' : 'ies'}`,
                { tone: 'success' },
              )
            }
          >
            <CloudIcon width={13} height={13} />
            Retrieve Pending Companies ({pendingCount})
          </button>
        </div>
      </div>

      <div className="card">
        <div className="tabs">
          <div
            className={cn('tab', tab === 'shortlist' && 'active')}
            onClick={() => setTab('shortlist')}
          >
            Shortlist <span className="count">{shortlisted.length}</span>
          </div>
          <div
            className={cn('tab', tab === 'excluded' && 'active')}
            onClick={() => setTab('excluded')}
          >
            Excluded <span className="count">{excluded.length}</span>
          </div>
          <div
            className={cn('tab', tab === 'all' && 'active')}
            onClick={() => setTab('all')}
          >
            All <span className="count">{companies.length}</span>
          </div>
          <div
            className={cn('tab', tab === 'deleted' && 'active')}
            onClick={() => setTab('deleted')}
          >
            Deleted <span className="count">{deletedList.length}</span>
          </div>
          <div className="spacer" />
          <div className="px-3 py-1.5">
            <div className="input-with-icon w-60">
              <SearchIcon
                width={13}
                height={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                className="input h-[30px] text-[12.5px]"
                placeholder="Search company\u2026"
                value={query}
                onChange={event => setQuery(event.target.value)}
              />
            </div>
          </div>
        </div>

        {filters.activeFilterCount > 0 && (
          <div className="flex items-center gap-2.5 border-b border-t border-line bg-accent-50 px-4 py-2.5 text-[12.5px]">
            <FilterIcon width={12} height={12} className="text-accent" />
            <span className="text-ink-700">
              {filters.activeFilterCount} filter
              {filters.activeFilterCount > 1 ? 's' : ''} applied &middot;
              showing {list.length} compan{list.length === 1 ? 'y' : 'ies'}
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm ml-auto h-6 text-[12px] text-accent"
              onClick={filters.clearAllFilters}
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="table-wrap" style={{ minHeight: TABLE_MIN_HEIGHT }}>
          <table className="tbl">
            <thead>
              <tr>
                {/* Company column — manually-added filter */}
                <th>
                  <span className="inline-flex items-center gap-1.5">
                    Company
                    <button
                      ref={companyFilterRef}
                      type="button"
                      className={cn(
                        'btn btn-icon btn-ghost h-5 w-5 p-0',
                        filters.filterManualOnly
                          ? 'text-accent'
                          : 'text-ink-400',
                      )}
                      title="Filter by source"
                      aria-label="Filter by source"
                      onClick={() => filters.toggleFilter('company')}
                    >
                      <FilterIcon width={11} height={11} />
                    </button>
                  </span>
                  {filters.openFilter === 'company' && (
                    <FilterDropdownPortal
                      anchorRef={companyFilterRef}
                      onClose={filters.closeFilter}
                    >
                      <div className="min-w-[200px] rounded-md border border-line bg-white p-2.5 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
                        <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-normal">
                          <Checkbox
                            checked={filters.filterManualOnly}
                            onChange={filters.setFilterManualOnly}
                          />
                          Manually added only
                        </label>
                      </div>
                    </FilterDropdownPortal>
                  )}
                </th>

                <th>RIC</th>

                {/* Supersector column — multi-select sector filter */}
                <th>
                  <span className="inline-flex items-center gap-1.5">
                    Supersector
                    <button
                      ref={sectorFilterRef}
                      type="button"
                      className={cn(
                        'btn btn-icon btn-ghost h-5 w-5 p-0',
                        filters.activeSectors.length > 0
                          ? 'text-accent'
                          : 'text-ink-400',
                      )}
                      title="Filter by sector"
                      aria-label="Filter by sector"
                      onClick={() => filters.toggleFilter('sector')}
                    >
                      <FilterIcon width={11} height={11} />
                    </button>
                  </span>
                  {filters.openFilter === 'sector' && (
                    <FilterDropdownPortal
                      anchorRef={sectorFilterRef}
                      onClose={filters.closeFilter}
                    >
                      <div className="max-h-[280px] min-w-[220px] overflow-auto rounded-md border border-line bg-white px-3 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
                        {filters.allSectors.map(sector => (
                          <label
                            key={sector}
                            className="flex cursor-pointer items-center gap-2 py-1 text-[12.5px] font-normal"
                          >
                            <Checkbox
                              checked={!!filters.filterSectors[sector]}
                              onChange={checked =>
                                filters.toggleSector(sector, checked)
                              }
                            />
                            {sector}
                          </label>
                        ))}
                      </div>
                    </FilterDropdownPortal>
                  )}
                </th>

                {/* Country column — multi-select country filter */}
                <th>
                  <span className="inline-flex items-center gap-1.5">
                    Country
                    <button
                      ref={countryFilterRef}
                      type="button"
                      className={cn(
                        'btn btn-icon btn-ghost h-5 w-5 p-0',
                        filters.activeCountries.length > 0
                          ? 'text-accent'
                          : 'text-ink-400',
                      )}
                      title="Filter by country"
                      aria-label="Filter by country"
                      onClick={() => filters.toggleFilter('country')}
                    >
                      <FilterIcon width={11} height={11} />
                    </button>
                  </span>
                  {filters.openFilter === 'country' && (
                    <FilterDropdownPortal
                      anchorRef={countryFilterRef}
                      onClose={filters.closeFilter}
                    >
                      <div className="max-h-[280px] min-w-[160px] overflow-auto rounded-md border border-line bg-white px-3 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
                        {filters.allCountries.map(country => (
                          <label
                            key={country}
                            className="flex cursor-pointer items-center gap-2 py-1 text-[12.5px] font-normal"
                          >
                            <Checkbox
                              checked={!!filters.filterCountries[country]}
                              onChange={checked =>
                                filters.toggleCountry(country, checked)
                              }
                            />
                            {country}
                          </label>
                        ))}
                      </div>
                    </FilterDropdownPortal>
                  )}
                </th>

                {/* Market cap column — dual range slider */}
                <th className="text-right">
                  <span className="inline-flex items-center gap-1.5">
                    Market cap
                    <button
                      ref={mcapFilterRef}
                      type="button"
                      className={cn(
                        'btn btn-icon btn-ghost h-5 w-5 p-0',
                        filters.hasMcapFilter ? 'text-accent' : 'text-ink-400',
                      )}
                      title="Filter by market cap"
                      aria-label="Filter by market cap"
                      onClick={() => filters.toggleFilter('mcap')}
                    >
                      <FilterIcon width={11} height={11} />
                    </button>
                  </span>
                  {filters.openFilter === 'mcap' && (
                    <FilterDropdownPortal
                      anchorRef={mcapFilterRef}
                      align="right"
                      onClose={filters.closeFilter}
                    >
                      <div className="w-60 rounded-md border border-line bg-white px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
                        <div className="mb-2 text-[12px] font-medium text-ink-700">
                          Range: &pound;{filters.filterMcapMin.toFixed(1)}bn
                          &ndash; &pound;{filters.filterMcapMax.toFixed(1)}bn
                        </div>
                        <div className="mb-2.5">
                          <div className="mb-1 text-[11px] text-ink-500">
                            Min
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={300}
                            step={0.5}
                            value={filters.filterMcapMin}
                            onChange={event =>
                              filters.setFilterMcapMin(
                                Math.min(
                                  Number(event.target.value),
                                  filters.filterMcapMax,
                                ),
                              )
                            }
                            className="w-full accent-accent"
                          />
                        </div>
                        <div>
                          <div className="mb-1 text-[11px] text-ink-500">
                            Max
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={300}
                            step={0.5}
                            value={filters.filterMcapMax}
                            onChange={event =>
                              filters.setFilterMcapMax(
                                Math.max(
                                  Number(event.target.value),
                                  filters.filterMcapMin,
                                ),
                              )
                            }
                            className="w-full accent-accent"
                          />
                        </div>
                      </div>
                    </FilterDropdownPortal>
                  )}
                </th>

                {/* Status column — multi-select status filter */}
                <th>
                  <span className="inline-flex items-center gap-1.5">
                    Status
                    <button
                      ref={statusFilterRef}
                      type="button"
                      className={cn(
                        'btn btn-icon btn-ghost h-5 w-5 p-0',
                        filters.activeStatuses.length > 0
                          ? 'text-accent'
                          : 'text-ink-400',
                      )}
                      title="Filter by status"
                      aria-label="Filter by status"
                      onClick={() => filters.toggleFilter('status')}
                    >
                      <FilterIcon width={11} height={11} />
                    </button>
                  </span>
                  {filters.openFilter === 'status' && (
                    <FilterDropdownPortal
                      anchorRef={statusFilterRef}
                      onClose={filters.closeFilter}
                    >
                      <div className="max-h-[280px] min-w-[220px] overflow-auto rounded-md border border-line bg-white px-3 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
                        {availableStatuses.map(status => (
                          <label
                            key={status}
                            className="flex cursor-pointer items-center gap-2 py-1 text-[12.5px] font-normal"
                          >
                            <Checkbox
                              checked={!!filters.filterStatuses[status]}
                              onChange={checked =>
                                filters.toggleStatus(status, checked)
                              }
                            />
                            {status}
                          </label>
                        ))}
                      </div>
                    </FilterDropdownPortal>
                  )}
                </th>

                <th className="col-actions" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td
                    colSpan={TABLE_COL_SPAN}
                    className="py-12 text-center text-[13px] text-ink-400"
                  >
                    No companies match the current filters
                  </td>
                </tr>
              ) : (
                list.map(company => (
                  <tr
                    key={company.id}
                    className={cn(company.deleted && 'opacity-50')}
                  >
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="grid size-6 shrink-0 place-items-center rounded-[5px] bg-accent-50 text-[10px] font-bold text-accent">
                          {company.name.slice(0, INITIALS_LENGTH).toUpperCase()}
                        </div>
                        <div>
                          <div
                            className={cn(
                              'inline-flex items-center gap-1.5 font-medium',
                              company.deleted && 'line-through',
                            )}
                          >
                            {company.name}
                            {company.manuallyAdded && (
                              <Badge tone="accent" withDot={false}>
                                manual
                              </Badge>
                            )}
                          </div>
                          <div className="text-[11px] text-ink-400">
                            {company.website}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-ink-700">
                      {deriveRic(company.name, company.country)}
                    </td>
                    <td className="text-ink-500">{company.sector}</td>
                    <td>{company.country}</td>
                    <td className="tnum text-right">
                      &pound;{company.mcap.toFixed(1)}bn
                    </td>
                    <td>{getStatusBadge(company)}</td>
                    <td className="col-actions">
                      {company.deleted && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => restoreCo(company.id)}
                          title="Restore"
                          aria-label="Restore company"
                        >
                          <RefreshIcon width={11} height={11} />
                          Restore
                        </button>
                      )}
                      {!company.deleted && tab === 'shortlist' && (
                        <button
                          type="button"
                          className="btn btn-icon btn-ghost"
                          onClick={() => removeCo(company.id)}
                          title="Remove"
                          aria-label="Remove company"
                        >
                          <TrashIcon width={13} height={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddCompanyModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAdd}
        existing={companies}
      />
    </div>
  );
};
