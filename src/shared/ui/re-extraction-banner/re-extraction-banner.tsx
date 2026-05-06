'use client';

import { IRun } from 'shared/api';
import { RefreshIcon } from 'shared/icons';

const PERCENT = 100;

interface IReExtractionBannerProps {
  run: IRun;
}

export const ReExtractionBanner = ({ run }: IReExtractionBannerProps) => {
  if (!run.reExtraction?.inProgress) {
    return null;
  }

  const { processed, total, startedAt } = run.reExtraction;
  const pct = total > 0 ? Math.round((processed / total) * PERCENT) : 0;

  return (
    <div
      className="card"
      style={{
        marginBottom: 14,
        background: '#FFF7E0',
        borderColor: '#F0B73C',
      }}
    >
      <div
        className="card-body"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '12px 16px',
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#F0B73C',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <RefreshIcon width={16} height={16} className="spin" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 13.5,
              color: 'var(--ink-900)',
            }}
          >
            Re-extraction in progress &middot; {processed} of {total} companies
            ({pct}%)
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--ink-700)',
              marginTop: 2,
            }}
          >
            Started {startedAt}. Showing previous results &mdash; they will be
            replaced when re-extraction completes. Downloads and
            &ldquo;Accept&rdquo; actions are temporarily disabled.
          </div>
        </div>
      </div>
    </div>
  );
};
