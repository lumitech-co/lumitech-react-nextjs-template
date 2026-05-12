'use client';

import { useCallback, useMemo, useState } from 'react';

import { ICompany, MOCK_COMPANIES } from 'shared/api';
import {
  CloudIcon,
  DownloadIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  TrashIcon,
} from 'shared/icons';
import { cn } from 'shared/lib';
import { Badge, useToast } from 'shared/ui';

import { AddCompanyModal } from './add-company-modal';

type Tab = 'shortlist' | 'excluded' | 'all' | 'deleted';

const INITIALS_LENGTH = 2;
const RIC_NAME_LENGTH = 4;

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
  const list = useMemo(() => {
    if (!query) {
      return baseList;
    }

    const lowerQuery = query.toLowerCase();

    return baseList.filter(company =>
      company.name.toLowerCase().includes(lowerQuery),
    );
  }, [baseList, query]);

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

        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Company</th>
                <th>RIC</th>
                <th>Supersector</th>
                <th>Country</th>
                <th className="text-right">Market cap</th>
                <th>Status</th>
                <th className="col-actions" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {list.map(company => (
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
              ))}
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
