'use client';

import { useRef, useState } from 'react';

import {
  formatMarketCapBillions,
  getExclusionBadgeLabel,
  useUniverseShortlist,
} from 'features';
import { IRunCompanyItem, RunCompanyStatus } from 'shared/api';
import {
  CloudIcon,
  DownloadIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from 'shared/icons';
import { cn } from 'shared/lib';
import { Badge, Checkbox } from 'shared/ui';

import { AddCompanyModal } from './add-company-modal';
import { FilterDropdownPortal } from './filter-dropdown-portal';

const INITIALS_LENGTH = 2;
const TABLE_MIN_HEIGHT = 200;
const TABLE_COL_SPAN = 7;

const getStatusBadge = (company: IRunCompanyItem) => {
  if (company.status === RunCompanyStatus.Deleted) {
    return <Badge tone="neutral">Deleted</Badge>;
  }

  if (company.status === RunCompanyStatus.Excluded) {
    const label = getExclusionBadgeLabel(company);

    return <Badge tone="danger">{label}</Badge>;
  }

  if (company.status === RunCompanyStatus.PendingRetrieval) {
    return <Badge tone="warning">Pending Retrieval</Badge>;
  }

  return <Badge tone="success">Passed</Badge>;
};

export const UniverseShortlist = () => {
  const [showAdd, setShowAdd] = useState(false);

  const companyFilterRef = useRef<HTMLButtonElement>(null);
  const sectorFilterRef = useRef<HTMLButtonElement>(null);
  const countryFilterRef = useRef<HTMLButtonElement>(null);
  const mcapFilterRef = useRef<HTMLButtonElement>(null);
  const statusFilterRef = useRef<HTMLButtonElement>(null);

  const {
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
    pendingRetrieval,
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
    isSearching,
    isAdding,
  } = useUniverseShortlist();

  const allSectors = filterOptions?.supersectors ?? [];
  const allCountries = filterOptions?.countries ?? [];
  const availableStatuses = filterOptions?.statuses ?? [];

  if (!runId) {
    return (
      <div className="content">
        <div className="page-header">
          <div className="page-title">Universe &amp; Shortlist</div>
          <div className="page-sub">
            Start a run from Screening Rules to load the company universe.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-header between">
        <div>
          <div className="page-title">Universe &amp; Shortlist</div>
          <div className="page-sub">
            {activeRun?.label ? `${activeRun.label} · ` : ''}
            {counts?.all ?? 0} companies in universe
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
            onClick={() => {
              exportCsv().catch(() => undefined);
            }}
          >
            <DownloadIcon width={13} height={13} />
            Export CSV
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={pendingRetrieval === 0}
            onClick={() => {
              retrievePending().catch(() => undefined);
            }}
          >
            <CloudIcon width={13} height={13} />
            Retrieve Pending Companies ({pendingRetrieval})
          </button>
        </div>
      </div>

      <div className="card">
        <div className="tabs">
          <div
            className={cn('tab', tab === 'shortlist' && 'active')}
            onClick={() => setTab('shortlist')}
          >
            Shortlist <span className="count">{counts?.shortlist ?? 0}</span>
          </div>
          <div
            className={cn('tab', tab === 'excluded' && 'active')}
            onClick={() => setTab('excluded')}
          >
            Excluded <span className="count">{counts?.excluded ?? 0}</span>
          </div>
          <div
            className={cn('tab', tab === 'all' && 'active')}
            onClick={() => setTab('all')}
          >
            All <span className="count">{counts?.all ?? 0}</span>
          </div>
          <div
            className={cn('tab', tab === 'deleted' && 'active')}
            onClick={() => setTab('deleted')}
          >
            Deleted <span className="count">{counts?.deleted ?? 0}</span>
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
                value={search}
                onChange={event => setSearch(event.target.value)}
              />
            </div>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2.5 border-b border-t border-line bg-accent-50 px-4 py-2.5 text-[12.5px]">
            <FilterIcon width={12} height={12} className="text-accent" />
            <span className="text-ink-700">
              {activeFilterCount} filter
              {activeFilterCount > 1 ? 's' : ''} applied &middot; showing{' '}
              {total} compan{total === 1 ? 'y' : 'ies'}
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm ml-auto h-6 text-[12px] text-accent"
              onClick={clearAllFilters}
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="table-wrap" style={{ minHeight: TABLE_MIN_HEIGHT }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>
                  <span className="inline-flex items-center gap-1.5">
                    Company
                    <button
                      ref={companyFilterRef}
                      type="button"
                      className={cn(
                        'btn btn-icon btn-ghost h-5 w-5 p-0',
                        filterManualOnly ? 'text-accent' : 'text-ink-400',
                      )}
                      title="Filter by source"
                      aria-label="Filter by source"
                      onClick={() => toggleFilter('company')}
                    >
                      <FilterIcon width={11} height={11} />
                    </button>
                  </span>
                  {openFilter === 'company' && (
                    <FilterDropdownPortal
                      anchorRef={companyFilterRef}
                      onClose={closeFilter}
                    >
                      <div className="min-w-[200px] rounded-md border border-line bg-white p-2.5 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
                        <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-normal">
                          <Checkbox
                            checked={filterManualOnly}
                            onChange={setFilterManualOnly}
                          />
                          Manually added only
                        </label>
                      </div>
                    </FilterDropdownPortal>
                  )}
                </th>
                <th>RIC</th>
                <th>
                  <span className="inline-flex items-center gap-1.5">
                    Supersector
                    <button
                      ref={sectorFilterRef}
                      type="button"
                      className={cn(
                        'btn btn-icon btn-ghost h-5 w-5 p-0',
                        Object.values(filterSectors).some(Boolean)
                          ? 'text-accent'
                          : 'text-ink-400',
                      )}
                      title="Filter by sector"
                      aria-label="Filter by sector"
                      onClick={() => toggleFilter('sector')}
                    >
                      <FilterIcon width={11} height={11} />
                    </button>
                  </span>
                  {openFilter === 'sector' && (
                    <FilterDropdownPortal
                      anchorRef={sectorFilterRef}
                      onClose={closeFilter}
                    >
                      <div className="max-h-[280px] min-w-[220px] overflow-auto rounded-md border border-line bg-white px-3 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
                        {allSectors.map(sector => (
                          <label
                            key={sector}
                            className="flex cursor-pointer items-center gap-2 py-1 text-[12.5px] font-normal"
                          >
                            <Checkbox
                              checked={!!filterSectors[sector]}
                              onChange={checked =>
                                toggleSector(sector, checked)
                              }
                            />
                            {sector}
                          </label>
                        ))}
                      </div>
                    </FilterDropdownPortal>
                  )}
                </th>
                <th>
                  <span className="inline-flex items-center gap-1.5">
                    Country
                    <button
                      ref={countryFilterRef}
                      type="button"
                      className={cn(
                        'btn btn-icon btn-ghost h-5 w-5 p-0',
                        Object.values(filterCountries).some(Boolean)
                          ? 'text-accent'
                          : 'text-ink-400',
                      )}
                      title="Filter by country"
                      aria-label="Filter by country"
                      onClick={() => toggleFilter('country')}
                    >
                      <FilterIcon width={11} height={11} />
                    </button>
                  </span>
                  {openFilter === 'country' && (
                    <FilterDropdownPortal
                      anchorRef={countryFilterRef}
                      onClose={closeFilter}
                    >
                      <div className="max-h-[280px] min-w-[160px] overflow-auto rounded-md border border-line bg-white px-3 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
                        {allCountries.map(country => (
                          <label
                            key={country}
                            className="flex cursor-pointer items-center gap-2 py-1 text-[12.5px] font-normal"
                          >
                            <Checkbox
                              checked={!!filterCountries[country]}
                              onChange={checked =>
                                toggleCountry(country, checked)
                              }
                            />
                            {country}
                          </label>
                        ))}
                      </div>
                    </FilterDropdownPortal>
                  )}
                </th>
                <th className="text-right">
                  <span className="inline-flex items-center gap-1.5">
                    Market cap
                    <button
                      ref={mcapFilterRef}
                      type="button"
                      className={cn(
                        'btn btn-icon btn-ghost h-5 w-5 p-0',
                        hasMcapFilter ? 'text-accent' : 'text-ink-400',
                      )}
                      title="Filter by market cap"
                      aria-label="Filter by market cap"
                      onClick={() => toggleFilter('mcap')}
                    >
                      <FilterIcon width={11} height={11} />
                    </button>
                  </span>
                  {openFilter === 'mcap' && (
                    <FilterDropdownPortal
                      anchorRef={mcapFilterRef}
                      align="right"
                      onClose={closeFilter}
                    >
                      <div className="w-60 rounded-md border border-line bg-white px-3.5 py-3 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
                        <div className="mb-2 text-[12px] font-medium text-ink-700">
                          Range: &pound;{filterMcapMin.toFixed(1)}bn &ndash;
                          &pound;
                          {filterMcapMax.toFixed(1)}bn
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
                            value={filterMcapMin}
                            onChange={event =>
                              setFilterMcapMin(
                                Math.min(
                                  Number(event.target.value),
                                  filterMcapMax,
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
                            value={filterMcapMax}
                            onChange={event =>
                              setFilterMcapMax(
                                Math.max(
                                  Number(event.target.value),
                                  filterMcapMin,
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
                <th>
                  <span className="inline-flex items-center gap-1.5">
                    Status
                    <button
                      ref={statusFilterRef}
                      type="button"
                      className={cn(
                        'btn btn-icon btn-ghost h-5 w-5 p-0',
                        Object.values(filterStatuses).some(Boolean)
                          ? 'text-accent'
                          : 'text-ink-400',
                      )}
                      title="Filter by status"
                      aria-label="Filter by status"
                      onClick={() => toggleFilter('status')}
                    >
                      <FilterIcon width={11} height={11} />
                    </button>
                  </span>
                  {openFilter === 'status' && (
                    <FilterDropdownPortal
                      anchorRef={statusFilterRef}
                      onClose={closeFilter}
                    >
                      <div className="max-h-[280px] min-w-[220px] overflow-auto rounded-md border border-line bg-white px-3 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
                        {availableStatuses.map(status => (
                          <label
                            key={status}
                            className="flex cursor-pointer items-center gap-2 py-1 text-[12.5px] font-normal"
                          >
                            <Checkbox
                              checked={!!filterStatuses[status]}
                              onChange={checked =>
                                toggleStatus(status, checked)
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
              {isCompaniesLoading && (
                <tr>
                  <td
                    colSpan={TABLE_COL_SPAN}
                    className="py-12 text-center text-[13px] text-ink-400"
                  >
                    Loading companies&hellip;
                  </td>
                </tr>
              )}
              {!isCompaniesLoading && companies.length === 0 && (
                <tr>
                  <td
                    colSpan={TABLE_COL_SPAN}
                    className="py-12 text-center text-[13px] text-ink-400"
                  >
                    No companies match the current filters
                  </td>
                </tr>
              )}
              {!isCompaniesLoading &&
                companies.map(company => {
                  const profile = company.companyProfile;
                  const isDeleted = company.status === RunCompanyStatus.Deleted;

                  return (
                    <tr
                      key={company.id}
                      className={cn(isDeleted && 'opacity-50')}
                    >
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="grid size-6 shrink-0 place-items-center rounded-[5px] bg-accent-50 text-[10px] font-bold text-accent">
                            {(
                              profile.name?.slice(0, INITIALS_LENGTH) ?? 'N/A'
                            ).toUpperCase()}
                          </div>
                          <div>
                            <div
                              className={cn(
                                'inline-flex items-center gap-1.5 font-medium',
                                isDeleted && 'line-through',
                              )}
                            >
                              {profile.name}
                              {company.isManuallyAdded && (
                                <Badge tone="accent" withDot={false}>
                                  manual
                                </Badge>
                              )}
                            </div>
                            <div className="text-[11px] text-ink-400">
                              {profile.domain ?? '—'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-ink-700">
                        {profile.ric ?? '—'}
                      </td>
                      <td className="text-ink-500">
                        {profile.supersector ?? '—'}
                      </td>
                      <td>{profile.country ?? '—'}</td>
                      <td className="tnum text-right">
                        {formatMarketCapBillions(company.marketCapGbp)}
                      </td>
                      <td>{getStatusBadge(company)}</td>
                      <td className="col-actions">
                        {isDeleted && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => {
                              restoreCompany(company.id).catch(() => undefined);
                            }}
                          >
                            Restore
                          </button>
                        )}
                        {!isDeleted && tab === 'shortlist' && (
                          <button
                            type="button"
                            className="btn btn-icon btn-ghost"
                            onClick={() => {
                              removeCompany(company.id).catch(() => undefined);
                            }}
                            title="Remove"
                            aria-label="Remove company"
                          >
                            <TrashIcon width={13} height={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <AddCompanyModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={addCompany}
        onSearch={searchCompany}
        isSearching={isSearching}
        isAdding={isAdding}
        existingNames={companies
          .map(company => company.companyProfile.name)
          .filter((name): name is string => name !== null)}
      />
    </div>
  );
};
