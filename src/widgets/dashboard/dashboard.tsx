'use client';

import { useState } from 'react';

import { formatRunDateTime, useRunStore } from 'entities';

import {
  HISTORICAL_SUMMARY_ROWS,
  HISTORICAL_WORKBOOK_ROWS,
  IArchivedRun,
  MOCK_ACTIVITY,
  MOCK_ARCHIVED_RUNS,
  MOCK_COMPANIES,
  MOCK_RUN,
} from 'shared/api';

import { ActivityFeed } from './activity-feed';
import { CompaniesPipeline } from './companies-pipeline';
import { PipelineProgress } from './pipeline-progress';
import { PreviousRuns } from './previous-runs';
import { RunCompletedBanner } from './run-completed-banner';
import { RunStats } from './run-stats';
import { ViewSummaryModal } from './view-summary-modal';
import { ViewWorkbooksModal } from './view-workbooks-modal';

export const Dashboard = () => {
  const [viewWorkbooks, setViewWorkbooks] = useState<IArchivedRun | null>(null);
  const [viewSummary, setViewSummary] = useState<IArchivedRun | null>(null);
  const activeRun = useRunStore(state => state.activeRun);

  const pageSubtitle = activeRun
    ? `${activeRun.label ?? 'Latest run'} · Started ${formatRunDateTime(activeRun.startedAt)} · ${activeRun.companyCount} companies`
    : 'No active run';

  return (
    <div className="content">
      <div className="page-header between">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">{pageSubtitle}</div>
        </div>
      </div>

      <RunCompletedBanner run={MOCK_RUN} />

      <PipelineProgress run={MOCK_RUN} companies={MOCK_COMPANIES} />

      <RunStats run={MOCK_RUN} />

      <div
        className="grid-2"
        style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'stretch' }}
      >
        <CompaniesPipeline companies={MOCK_COMPANIES} />
        <div className="col gap-16">
          <ActivityFeed items={MOCK_ACTIVITY} />
        </div>
      </div>

      <PreviousRuns
        archivedRuns={MOCK_ARCHIVED_RUNS}
        onViewWorkbooks={setViewWorkbooks}
        onViewSummary={setViewSummary}
      />

      <ViewWorkbooksModal
        run={viewWorkbooks}
        rows={HISTORICAL_WORKBOOK_ROWS}
        onClose={() => setViewWorkbooks(null)}
      />

      <ViewSummaryModal
        run={viewSummary}
        rows={HISTORICAL_SUMMARY_ROWS}
        onClose={() => setViewSummary(null)}
      />
    </div>
  );
};
