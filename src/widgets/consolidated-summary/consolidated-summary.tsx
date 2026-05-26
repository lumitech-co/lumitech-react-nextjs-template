'use client';

import { useMemo } from 'react';

import {
  buildMockSummary,
  MOCK_COMPANIES,
  MOCK_REVIEW_ITEMS,
  MOCK_RUN,
} from 'shared/api';
import { DownloadIcon, EyeIcon } from 'shared/icons';
import { ReExtractionBanner, useToast, XlsxViewer } from 'shared/ui';

export const ConsolidatedSummary = () => {
  const run = MOCK_RUN;
  const companies = MOCK_COMPANIES;
  const reviewItems = MOCK_REVIEW_ITEMS;
  const toast = useToast();

  const done = useMemo(
    () => companies.filter(company => company.stage === 'done'),
    [companies],
  );

  const outlierCount = useMemo(
    () => reviewItems.filter(review => review.flag === 'outlier').length,
    [reviewItems],
  );

  const summaryBuffer = useMemo(
    () => buildMockSummary(companies, reviewItems),
    [companies, reviewItems],
  );

  return (
    <div className="content">
      <div className="page-header between">
        <div>
          <div className="page-title">Consolidated Summary</div>
          <div className="page-sub">
            All processed companies in one workbook &middot; scores by year,
            outlier flags, conviction. Generated after all individual workbooks
            are ready.
          </div>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={run?.reExtraction?.inProgress}
          >
            <EyeIcon width={13} height={13} />
            Preview
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={run?.reExtraction?.inProgress}
            onClick={() =>
              toast(
                'Summary downloaded \u00B7 iron-blue-summary-2026-04-30.xlsx',
                { tone: 'success' },
              )
            }
          >
            <DownloadIcon width={13} height={13} />
            Download Summary
          </button>
        </div>
      </div>

      <ReExtractionBanner run={run} />

      <div className="stat-grid mb-4">
        <div className="stat">
          <div className="stat-label">Companies</div>
          <div className="stat-value">{done.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Avg score (FY25)</div>
          <div className="stat-value">7.2</div>
        </div>
        <div className="stat">
          <div className="stat-label">Outlier flags</div>
          <div className="stat-value text-danger">{outlierCount}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Overall conviction</div>
          <div className="stat-value">{run.overallConviction}%</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">summary.xlsx &middot; preview</div>
        </div>
        <div className="bg-surface-2 p-4">
          <XlsxViewer data={summaryBuffer} />
        </div>
      </div>
    </div>
  );
};
