'use client';

import { useMemo, useState } from 'react';

import {
  formatRunDateTime,
  useGetActivities,
  useGetLatestRun,
  useGetRunStats,
  useListPipelineCompanies,
  useListPreviousRuns,
} from 'entities';

import { IArchivedRun } from 'shared/api';

import { ActivityFeed } from './activity-feed';
import { CompaniesPipeline } from './companies-pipeline';
import { PipelineProgress } from './pipeline-progress';
import { PreviousRuns } from './previous-runs';
import { mapRunToPreviousRun } from './previous-runs/map-run-to-previous-run';
import { RunCompletedBanner } from './run-completed-banner';
import { RunStats } from './run-stats';
import { ViewSummaryModal } from './view-summary-modal';
import { ViewWorkbooksModal } from './view-workbooks-modal';

export const Dashboard = () => {
  const [viewWorkbooks, setViewWorkbooks] = useState<IArchivedRun | null>(null);
  const [viewSummary, setViewSummary] = useState<IArchivedRun | null>(null);

  const { data: latestRunResponse, isLoading: isLatestRunLoading } =
    useGetLatestRun();
  const activeRun = latestRunResponse?.data ?? null;
  const runId = activeRun?.id;
  const runStatus = activeRun?.status;

  const { data: stats, isLoading: isStatsLoading } = useGetRunStats(
    runId,
    runStatus,
  );
  const {
    data: activitiesData,
    isLoading: isActivitiesLoading,
    fetchNextPage: fetchNextActivities,
    hasNextPage: hasNextActivities = false,
    isFetchingNextPage: isFetchingNextActivities,
  } = useGetActivities();
  const activities = activitiesData?.pages.flatMap(page => page.data) ?? [];

  const {
    data: pipelineCompaniesData,
    isLoading: isPipelineLoading,
    fetchNextPage: fetchNextPipelineCompanies,
    hasNextPage: hasNextPipelineCompanies = false,
    isFetchingNextPage: isFetchingNextPipelineCompanies,
  } = useListPipelineCompanies(runId, runStatus);
  const pipelineCompanies =
    pipelineCompaniesData?.pages.flatMap(page => page.data) ?? [];

  const {
    data: previousRunsData,
    isLoading: isPreviousRunsLoading,
    fetchNextPage: fetchNextPreviousRuns,
    hasNextPage: hasNextPreviousRuns = false,
    isFetchingNextPage: isFetchingNextPreviousRuns,
  } = useListPreviousRuns();

  const previousRuns = useMemo(
    () =>
      previousRunsData?.pages
        .flatMap(page => page.data)
        .filter(run => run.id !== activeRun?.id)
        .map(mapRunToPreviousRun) ?? [],
    [previousRunsData, activeRun?.id],
  );

  const pageSubtitle = (() => {
    if (activeRun) {
      return `${activeRun.label ?? 'Latest run'} · Started ${formatRunDateTime(activeRun.startedAt)} · ${activeRun.companyCount} companies`;
    }

    if (isLatestRunLoading) {
      return 'Loading run…';
    }

    return 'No active run';
  })();

  return (
    <div className="content">
      <div className="page-header between">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">{pageSubtitle}</div>
        </div>
      </div>

      {activeRun && stats && activeRun.status === 'completed' && (
        <RunCompletedBanner
          run={activeRun}
          processedCount={stats.processedDone}
        />
      )}

      {activeRun && stats && (
        <>
          <PipelineProgress stats={stats} runStatus={activeRun.status} />
          <RunStats stats={stats} />
        </>
      )}

      {activeRun && !stats && isStatsLoading && (
        <div className="card mb-4 p-4 text-sm text-ink-400">
          Loading run stats&hellip;
        </div>
      )}

      {activeRun && (
        <div
          className="grid-2"
          style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'stretch' }}
        >
          <CompaniesPipeline
            companies={pipelineCompanies}
            isLoading={isPipelineLoading}
            hasNextPage={hasNextPipelineCompanies}
            isFetchingNextPage={isFetchingNextPipelineCompanies}
            onLoadMore={() => fetchNextPipelineCompanies()}
          />
          <div className="col gap-16">
            <ActivityFeed
              items={activities}
              isLoading={isActivitiesLoading}
              hasNextPage={hasNextActivities}
              isFetchingNextPage={isFetchingNextActivities}
              onLoadMore={() => fetchNextActivities()}
            />
          </div>
        </div>
      )}

      {!activeRun && !isLatestRunLoading && (
        <ActivityFeed
          items={activities}
          isLoading={isActivitiesLoading}
          hasNextPage={hasNextActivities}
          isFetchingNextPage={isFetchingNextActivities}
          onLoadMore={() => fetchNextActivities()}
        />
      )}

      {!activeRun && !isLatestRunLoading && (
        <div className="card p-4 text-sm text-ink-400">
          Start a run from Screening Rules to see pipeline progress here.
        </div>
      )}

      <PreviousRuns
        archivedRuns={previousRuns}
        isLoading={isPreviousRunsLoading}
        hasNextPage={hasNextPreviousRuns}
        isFetchingNextPage={isFetchingNextPreviousRuns}
        onLoadMore={() => fetchNextPreviousRuns()}
      />

      <ViewWorkbooksModal
        run={viewWorkbooks}
        rows={[]}
        onClose={() => setViewWorkbooks(null)}
      />

      <ViewSummaryModal
        run={viewSummary}
        rows={[]}
        onClose={() => setViewSummary(null)}
      />
    </div>
  );
};
