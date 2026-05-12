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
import { ReuploadConfirmModal } from './reupload-confirm-modal';
import { UploadReportModal } from './upload-report-modal';

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
  const [reuploadConfirm, setReuploadConfirm] = useState<{
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
        <td key={year} className="text-center">
          <div className="inline-flex flex-col items-center gap-0.5">
            {statusBadge(report.status)}
            {(report.status === 'Retrieved' ||
              report.status === 'Manually Uploaded') && (
              <div className="flex gap-0.5">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm h-5 px-1.5 text-[11px] text-accent"
                >
                  <EyeIcon width={10} height={10} />
                  View
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm h-5 px-1.5 text-[11px] text-accent"
                  onClick={() => setReuploadConfirm({ company, year })}
                >
                  <UploadIcon width={10} height={10} />
                  Re-upload
                </button>
              </div>
            )}
            {(report.status === 'Not Retrieved' ||
              report.status === 'Not Published') && (
              <button
                type="button"
                className="btn btn-ghost btn-sm h-5 px-1.5 text-[11px] text-accent"
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
      <td key={year} className="text-center">
        <div className="inline-flex flex-col items-center gap-0.5">
          <span className="text-xs text-ink-300">&mdash;</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm h-5 px-1.5 text-[11px] text-accent"
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
                <th>Official website</th>
                <th className="w-8 p-0">
                  <button
                    type="button"
                    className={cn(
                      'btn btn-icon btn-ghost size-7',
                      !canGoOlder && 'opacity-30',
                    )}
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
                  >
                    <ChevronLeftIcon width={13} height={13} />
                  </button>
                </th>
                {visibleYears.map(year => (
                  <th key={year} className="text-center">
                    {year}
                  </th>
                ))}
                <th className="w-8 p-0">
                  <button
                    type="button"
                    className={cn(
                      'btn btn-icon btn-ghost size-7',
                      !canGoNewer && 'opacity-30',
                    )}
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
                    <div className="flex items-center gap-1.5 font-medium">
                      {company.name}
                      {company.manuallyAdded && (
                        <Badge tone="accent" withDot={false}>
                          manual
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-ink-400">
                      {company.country} &middot; {company.sector}
                      {company.manuallyAdded && company.sourceListing
                        ? ` \u00B7 ${company.sourceListing}`
                        : ''}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <GlobeIcon
                        width={12}
                        height={12}
                        className="text-ink-400"
                      />
                      <a className="link text-[12.5px]">{company.website}</a>
                      <button
                        type="button"
                        className="btn btn-icon btn-ghost size-[22px]"
                        onClick={() => setEditWebsite(company)}
                        aria-label="Edit website"
                      >
                        <EditIcon width={11} height={11} />
                      </button>
                    </div>
                  </td>
                  <td className="bg-surface-2 p-0" />
                  {visibleYears.map(year => renderYearCell(company, year))}
                  <td className="bg-surface-2 p-0" />
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

      <ReuploadConfirmModal
        target={reuploadConfirm}
        onClose={() => setReuploadConfirm(null)}
        onConfirm={() => {
          const context = reuploadConfirm;

          setReuploadConfirm(null);

          if (context) {
            setUploadFor(context);
          }
        }}
      />
    </div>
  );
};
