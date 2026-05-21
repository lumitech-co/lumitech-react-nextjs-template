'use client';

import { useRouter } from 'next/navigation';

import { formatRunDateTime } from 'entities';

import { ILatestRunItem } from 'shared/api';
import { CheckIcon, InboxIcon, LayersIcon } from 'shared/icons';

import { ROUTE_PATHS } from '../../app-shell/sidebar/nav-config';

interface IRunCompletedBannerProps {
  run: ILatestRunItem;
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
    <div
      className="card"
      style={{
        marginBottom: 16,
        background: 'var(--success-50, #ECFDF3)',
        borderColor: 'var(--success, #16A34A)',
      }}
    >
      <div
        className="card-body"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 18px',
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--success, #16A34A)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <CheckIcon width={18} height={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-900)' }}
          >
            Run completed
          </div>
          <div
            style={{ fontSize: 12.5, color: 'var(--ink-700)', marginTop: 2 }}
          >
            Finished {completedLabel} · {processedCount} companies processed ·{' '}
            {run.flaggedCount} flagged for review · Overall conviction{' '}
            {convictionLabel}%
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
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
