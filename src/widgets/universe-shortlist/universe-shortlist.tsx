'use client';

import { useCallback, useMemo, useState } from 'react';

import { ICompany, MOCK_COMPANIES } from 'shared/api';
import {
  CloudIcon,
  DownloadIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from 'shared/icons';
import { cn } from 'shared/lib';
import { Badge, useToast } from 'shared/ui';

import { AddCompanyModal } from './add-company-modal';

/* eslint-disable no-magic-numbers */

type Tab = 'shortlist' | 'excluded' | 'all';

const INITIALS_LENGTH = 2;

const getStatusBadge = (company: ICompany) => {
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
    () => companies.filter(company => !company.excluded),
    [companies],
  );
  const excluded = useMemo(
    () => companies.filter(company => company.excluded),
    [companies],
  );

  const getBaseList = (): ICompany[] => {
    if (tab === 'shortlist') {
      return shortlisted;
    }

    if (tab === 'excluded') {
      return excluded;
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
      setCompanies(prev => prev.filter(company => company.id !== companyId));
      toast('Company removed from shortlist');
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
          <div className="spacer" />
          <div style={{ padding: '6px 12px' }}>
            <div className="input-with-icon" style={{ width: 240 }}>
              <SearchIcon
                width={13}
                height={13}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--ink-400)',
                }}
              />
              <input
                className="input"
                style={{ height: 30, fontSize: 12.5 }}
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
                <th className="text-right">Company</th>
                <th className="text-right">Supersector</th>
                <th className="text-right">Country</th>
                <th className="text-right">Market cap</th>
                <th className="text-right">Weight</th>
                <th className="text-right">Source</th>
                <th className="text-right">Status</th>
                {tab === 'shortlist' && (
                  <th className="col-actions" aria-label="Actions" />
                )}
              </tr>
            </thead>
            <tbody>
              {list.map(company => (
                <tr key={company.id}>
                  <td className="text-right">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        justifyContent: 'flex-end',
                      }}
                    >
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            justifyContent: 'flex-end',
                          }}
                        >
                          {company.name}
                          {company.manuallyAdded && (
                            <Badge tone="accent" withDot={false}>
                              manual
                            </Badge>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--ink-400)' }}>
                          {company.website}
                        </div>
                      </div>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 5,
                          background: 'var(--accent-50)',
                          color: 'var(--accent)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 10,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {company.name.slice(0, INITIALS_LENGTH).toUpperCase()}
                      </div>
                    </div>
                  </td>
                  <td
                    className="text-right"
                    style={{ color: 'var(--ink-500)' }}
                  >
                    {company.sector}
                  </td>
                  <td className="text-right">{company.country}</td>
                  <td className="tnum text-right">
                    &pound;{company.mcap.toFixed(1)}bn
                  </td>
                  <td className="tnum text-right">
                    {company.weight.toFixed(2)}%
                  </td>
                  <td className="text-right">
                    <span
                      className="badge badge-neutral"
                      style={{ textTransform: 'none' }}
                    >
                      {company.sourceListing || 'STOXX 600'}
                    </span>
                  </td>
                  <td className="text-right">{getStatusBadge(company)}</td>
                  {tab === 'shortlist' && (
                    <td className="col-actions">
                      <button
                        type="button"
                        className="btn btn-icon btn-ghost"
                        onClick={() => removeCo(company.id)}
                        title="Remove"
                        aria-label="Remove company"
                      >
                        <TrashIcon width={13} height={13} />
                      </button>
                    </td>
                  )}
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
