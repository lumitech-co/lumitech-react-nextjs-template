'use client';

import { useState } from 'react';

import {
  mapAnnualReportStatus,
  ReportDisplayStatus,
  useReportRetrieval,
} from 'features';
import { IAnnualReportItem, IReportCompanyItem } from 'shared/api';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  GlobeIcon,
  SearchIcon,
  UploadIcon,
} from 'shared/icons';
import { cn, toWebsiteUrl } from 'shared/lib';
import { Badge } from 'shared/ui';

import { ReuploadConfirmModal } from './reupload-confirm-modal';
import { UploadReportModal } from './upload-report-modal';

const TABLE_EXTRA_COLUMNS = 4;

const statusBadge = (status: ReportDisplayStatus | null) => {
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
  const [uploadFor, setUploadFor] = useState<{
    company: IReportCompanyItem;
    year: number;
  } | null>(null);
  const [reuploadConfirm, setReuploadConfirm] = useState<{
    company: IReportCompanyItem;
    year: number;
  } | null>(null);

  const {
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
    setWindowStart,
    canGoOlder,
    canGoNewer,
    uploadReport,
    isUploading,
    openReport,
    isOpeningReport,
  } = useReportRetrieval();

  const renderYearCell = (company: IReportCompanyItem, year: number) => {
    const report: IAnnualReportItem | undefined = company.reports.find(
      rep => rep.year === year,
    );

    const displayStatus = mapAnnualReportStatus(report?.status ?? null);

    if (report && displayStatus) {
      return (
        <td key={year} className="text-center">
          <div className="inline-flex flex-col items-center gap-0.5">
            {statusBadge(displayStatus)}
            {(displayStatus === 'Retrieved' ||
              displayStatus === 'Manually Uploaded') && (
              <div className="flex gap-0.5">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm h-5 px-1.5 text-[11px] text-accent"
                  disabled={!report.filePath || isOpeningReport}
                  onClick={() => openReport(report.filePath)}
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
            {(displayStatus === 'Not Retrieved' ||
              displayStatus === 'Not Published') && (
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

  if (!runId) {
    return (
      <div className="content">
        <div className="page-header">
          <div className="page-title">Report Retrieval</div>
          <div className="page-sub">
            Start a run from Screening Rules to view annual reports.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-header between">
        <div>
          <div className="page-title">Report Retrieval</div>
          <div className="page-sub">
            {activeRun?.label ? `${activeRun.label} · ` : ''}
            Annual reports for shortlisted companies. Statuses: Retrieved
            &middot; Not Published &middot; Not Retrieved &middot; Manually
            Uploaded.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="tabs">
          <div
            className={cn('tab', filter === 'all' && 'active')}
            onClick={() => setFilter('all')}
          >
            All companies <span className="count">{counts?.all ?? 0}</span>
          </div>
          <div
            className={cn('tab', filter === 'issues' && 'active')}
            onClick={() => setFilter('issues')}
          >
            Not retrieved{' '}
            <span className="count">{counts?.notRetrieved ?? 0}</span>
          </div>
          <div
            className={cn('tab', filter === 'not_published' && 'active')}
            onClick={() => setFilter('not_published')}
          >
            Not published{' '}
            <span className="count">{counts?.notPublished ?? 0}</span>
          </div>
          <div
            className={cn('tab', filter === 'manual' && 'active')}
            onClick={() => setFilter('manual')}
          >
            Manual uploads{' '}
            <span className="count">{counts?.manualUploads ?? 0}</span>
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
                placeholder="Search company..."
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
                    onClick={() => setWindowStart(prev => prev + 1)}
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
              {isReportsLoading && (
                <tr>
                  <td
                    colSpan={visibleYears.length + TABLE_EXTRA_COLUMNS}
                    className="py-12 text-center text-[13px] text-ink-400"
                  >
                    Loading reports&hellip;
                  </td>
                </tr>
              )}
              {!isReportsLoading && companies.length === 0 && (
                <tr>
                  <td
                    colSpan={visibleYears.length + TABLE_EXTRA_COLUMNS}
                    className="py-12 text-center text-[13px] text-ink-400"
                  >
                    No companies match the current filters
                  </td>
                </tr>
              )}
              {!isReportsLoading &&
                companies.map(company => {
                  const profile = company.companyProfile;

                  return (
                    <tr key={company.id}>
                      <td>
                        <div className="flex items-center gap-1.5 font-medium">
                          {profile.name ?? '—'}
                          {company.isManuallyAdded && (
                            <Badge tone="accent" withDot={false}>
                              manual
                            </Badge>
                          )}
                        </div>
                        <div className="text-[11px] text-ink-400">
                          {profile.country ?? '—'} &middot;{' '}
                          {profile.supersector ?? '—'}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <GlobeIcon
                            width={12}
                            height={12}
                            className="text-ink-400"
                          />
                          {profile.domain ? (
                            <a
                              className="link text-[12.5px]"
                              href={toWebsiteUrl(profile.domain) ?? undefined}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {profile.domain}
                            </a>
                          ) : (
                            <span className="text-[12.5px]">—</span>
                          )}
                        </div>
                      </td>
                      <td className="bg-surface-2 p-0" />
                      {visibleYears.map(year => renderYearCell(company, year))}
                      <td className="bg-surface-2 p-0" />
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <UploadReportModal
        target={uploadFor}
        isUploading={isUploading}
        onUpload={uploadReport}
        onClose={() => setUploadFor(null)}
      />

      <ReuploadConfirmModal
        target={
          reuploadConfirm
            ? {
                companyName: reuploadConfirm.company.companyProfile.name ?? '—',
                year: reuploadConfirm.year,
              }
            : null
        }
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
