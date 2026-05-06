'use client';

import { useMemo, useState } from 'react';

import { ICompany, IReport, MOCK_COMPANIES } from 'shared/api';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  EyeIcon,
  GlobeIcon,
  SearchIcon,
  UploadIcon,
} from 'shared/icons';
import { cn } from 'shared/lib';
import { Badge } from 'shared/ui';

import { EditWebsiteModal } from './edit-website-modal';
import { UploadReportModal } from './upload-report-modal';

/* eslint-disable no-magic-numbers */

type Filter = 'all' | 'issues' | 'not_published' | 'manual';

const WINDOW_SIZE = 3;
const VISIBLE_LIMIT = 20;

const statusBadge = (status: string) => {
  if (status === 'Retrieved') {
    return <Badge tone="success">Retrieved</Badge>;
  }

  if (status === 'Manually Uploaded') {
    return <Badge tone="accent">Manually uploaded</Badge>;
  }

  if (status === 'Not Retrieved') {
    return <Badge tone="danger">Not retrieved</Badge>;
  }

  if (status === 'Not Published') {
    return <Badge tone="neutral">Not published</Badge>;
  }

  return <Badge tone="neutral">&mdash;</Badge>;
};

export const ReportRetrieval = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [editWebsite, setEditWebsite] = useState<ICompany | null>(null);
  const [uploadFor, setUploadFor] = useState<{
    company: ICompany;
    year: number;
  } | null>(null);
  const [windowStart, setWindowStart] = useState(0);

  const nonExcluded = useMemo(
    () => MOCK_COMPANIES.filter(company => !company.excluded),
    [],
  );

  const allYears = useMemo(() => {
    const years = new Set<number>();

    nonExcluded.forEach(company => {
      company.reports.forEach(report => years.add(report.year));
    });

    return Array.from(years).sort(
      (leftYear, rightYear) => rightYear - leftYear,
    );
  }, [nonExcluded]);

  const maxStart = Math.max(0, allYears.length - WINDOW_SIZE);
  const safeStart = Math.min(windowStart, maxStart);
  const visibleYears = allYears.slice(safeStart, safeStart + WINDOW_SIZE);
  const canGoNewer = safeStart > 0;
  const canGoOlder = safeStart < maxStart;

  const issuesCount = useMemo(
    () =>
      nonExcluded.filter(company =>
        company.reports.some(report => report.status === 'Not Retrieved'),
      ).length,
    [nonExcluded],
  );

  const notPublishedCount = useMemo(
    () =>
      nonExcluded.filter(company =>
        company.reports.some(report => report.status === 'Not Published'),
      ).length,
    [nonExcluded],
  );

  const manualCount = useMemo(
    () =>
      nonExcluded.filter(company =>
        company.reports.some(report => report.status === 'Manually Uploaded'),
      ).length,
    [nonExcluded],
  );

  const list = useMemo(() => {
    let filtered = nonExcluded;

    if (query) {
      const lowerQuery = query.toLowerCase();

      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(lowerQuery),
      );
    }

    if (filter === 'issues') {
      filtered = filtered.filter(company =>
        company.reports.some(report => report.status === 'Not Retrieved'),
      );
    } else if (filter === 'not_published') {
      filtered = filtered.filter(company =>
        company.reports.some(report => report.status === 'Not Published'),
      );
    } else if (filter === 'manual') {
      filtered = filtered.filter(company =>
        company.reports.some(report => report.status === 'Manually Uploaded'),
      );
    }

    return filtered;
  }, [nonExcluded, query, filter]);

  const renderYearCell = (company: ICompany, year: number) => {
    const report: IReport | undefined = company.reports.find(
      rep => rep.year === year,
    );

    if (report) {
      return (
        <td key={year} style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {statusBadge(report.status)}
            {(report.status === 'Retrieved' ||
              report.status === 'Manually Uploaded') && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{
                  height: 20,
                  padding: '0 6px',
                  fontSize: 11,
                  color: 'var(--ink-500)',
                }}
              >
                <EyeIcon width={10} height={10} />
                View
              </button>
            )}
            {(report.status === 'Not Retrieved' ||
              report.status === 'Not Published') && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{
                  height: 20,
                  padding: '0 6px',
                  fontSize: 11,
                  color: 'var(--accent)',
                }}
                onClick={() => setUploadFor({ company, year })}
              >
                <UploadIcon width={10} height={10} />
                Upload
              </button>
            )}
          </div>
        </td>
      );
    }

    return (
      <td key={year} style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <span style={{ color: 'var(--ink-300)', fontSize: 12 }}>&mdash;</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{
              height: 20,
              padding: '0 6px',
              fontSize: 11,
              color: 'var(--accent)',
            }}
            onClick={() => setUploadFor({ company, year })}
          >
            <UploadIcon width={10} height={10} />
            Upload
          </button>
        </div>
      </td>
    );
  };

  return (
    <div className="content">
      <div className="page-header between">
        <div>
          <div className="page-title">Report Retrieval</div>
          <div className="page-sub">
            Annual reports for the last 3 reporting years are shown by default.
            Earlier years can be revealed if available. Only PDF &quot;Annual
            Report&quot; or &quot;Universal Registration Document&quot; sources
            are accepted. Statuses: Retrieved &middot; Not Published &middot;
            Not Retrieved &middot; Manually Uploaded.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="tabs">
          <div
            className={cn('tab', filter === 'all' && 'active')}
            onClick={() => setFilter('all')}
          >
            All companies <span className="count">{nonExcluded.length}</span>
          </div>
          <div
            className={cn('tab', filter === 'issues' && 'active')}
            onClick={() => setFilter('issues')}
          >
            Not retrieved <span className="count">{issuesCount}</span>
          </div>
          <div
            className={cn('tab', filter === 'not_published' && 'active')}
            onClick={() => setFilter('not_published')}
          >
            Not published <span className="count">{notPublishedCount}</span>
          </div>
          <div
            className={cn('tab', filter === 'manual' && 'active')}
            onClick={() => setFilter('manual')}
          >
            Manual uploads <span className="count">{manualCount}</span>
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
                <th>Company</th>
                <th>Official website</th>
                <th style={{ width: 32, padding: 0 }}>
                  <button
                    type="button"
                    className="btn btn-icon btn-ghost"
                    disabled={!canGoOlder}
                    aria-label="View older years"
                    title={
                      canGoOlder
                        ? `View older years (showing ${visibleYears[visibleYears.length - 1] ?? ''} \u2013 ${visibleYears[0] ?? ''})`
                        : 'No earlier years available'
                    }
                    onClick={() =>
                      setWindowStart(prev => Math.min(maxStart, prev + 1))
                    }
                    style={{
                      height: 28,
                      width: 28,
                      opacity: canGoOlder ? 1 : 0.3,
                    }}
                  >
                    <ChevronLeftIcon width={13} height={13} />
                  </button>
                </th>
                {visibleYears.map(year => (
                  <th key={year} style={{ textAlign: 'center' }}>
                    {year}
                  </th>
                ))}
                <th style={{ width: 32, padding: 0 }}>
                  <button
                    type="button"
                    className="btn btn-icon btn-ghost"
                    disabled={!canGoNewer}
                    aria-label="View newer years"
                    title={
                      canGoNewer
                        ? 'View newer years'
                        : 'Showing the most recent years'
                    }
                    onClick={() =>
                      setWindowStart(prev => Math.max(0, prev - 1))
                    }
                    style={{
                      height: 28,
                      width: 28,
                      opacity: canGoNewer ? 1 : 0.3,
                    }}
                  >
                    <ChevronRightIcon width={13} height={13} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.slice(0, VISIBLE_LIMIT).map(company => (
                <tr key={company.id}>
                  <td>
                    <div
                      style={{
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
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
                      {company.country} &middot; {company.sector}
                      {company.manuallyAdded && company.sourceListing
                        ? ` \u00B7 ${company.sourceListing}`
                        : ''}
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <GlobeIcon
                        width={12}
                        height={12}
                        style={{ color: 'var(--ink-400)' }}
                      />
                      <a className="link" style={{ fontSize: 12.5 }}>
                        {company.website}
                      </a>
                      <button
                        type="button"
                        className="btn btn-icon btn-ghost"
                        onClick={() => setEditWebsite(company)}
                        style={{ height: 22, width: 22 }}
                        aria-label="Edit website"
                      >
                        <EditIcon width={11} height={11} />
                      </button>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: 0,
                      background: 'var(--surface-2, #FAFAFA)',
                    }}
                  />
                  {visibleYears.map(year => renderYearCell(company, year))}
                  <td
                    style={{
                      padding: 0,
                      background: 'var(--surface-2, #FAFAFA)',
                    }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditWebsiteModal
        company={editWebsite}
        onClose={() => setEditWebsite(null)}
      />

      <UploadReportModal
        target={uploadFor}
        onClose={() => setUploadFor(null)}
      />
    </div>
  );
};
