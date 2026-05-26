'use client';

import { useRouter } from 'next/navigation';

import { formatRunDateTime } from 'entities';

import { IRunItem } from 'shared/api';
import { CheckIcon, InboxIcon, LayersIcon } from 'shared/icons';

import { ROUTE_PATHS } from '../../app-shell/sidebar/nav-config';

interface IRunCompletedBannerProps {
  run: IRunItem;
  processedCount: number;
}

export const RunCompletedBanner = ({
  run,
  processedCount,
}: IRunCompletedBannerProps) => {
  const router = useRouter();

  if (run.status !== 'completed') {
    return null;
  }

  const completedLabel = run.completedAt
    ? formatRunDateTime(run.completedAt)
    : 'Recently';
  const convictionLabel = run.overallConvictionPct ?? '—';

  return (
    <div className="card mb-4 border-success bg-success-bg">
      <div className="card-body flex items-center gap-3.5 px-[18px] py-3.5">
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-success text-white">
          <CheckIcon width={18} height={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-ink-900">
            Run completed
          </div>
          <div className="mt-0.5 text-[12.5px] text-ink-700">
            Finished {completedLabel} · {processedCount} companies processed ·{' '}
            {run.flaggedCount} flagged for review · Overall conviction{' '}
            {convictionLabel}%
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {run.flaggedCount > 0 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.push(ROUTE_PATHS.review)}
            >
              <InboxIcon width={13} height={13} />
              Open Review Queue
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => router.push(ROUTE_PATHS.summary)}
          >
            <LayersIcon width={13} height={13} />
            View Consolidated Summary
          </button>
        </div>
      </div>
    </div>
  );
};
