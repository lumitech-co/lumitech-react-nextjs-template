'use client';

import { IArchivedRun, isCompletedRunStatus } from 'shared/api';
import { ArchiveIcon, LayersIcon, XlsIcon } from 'shared/icons';
import { useInfiniteScroll } from 'shared/lib';
import { Badge, useToast } from 'shared/ui';

const SCROLL_BODY_MAX_HEIGHT = 320;

interface IPreviousRunsProps {
  archivedRuns: IArchivedRun[];
  isLoading?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

const formatRunStatusLabel = (status: IArchivedRun['status']): string =>
  status.charAt(0).toUpperCase() + status.slice(1);

export const PreviousRuns = ({
  archivedRuns,
  isLoading = false,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: IPreviousRunsProps) => {
  const toast = useToast();
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: onLoadMore,
  });

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-header between">
        <div>
          <div className="card-title">Previous Runs</div>
          <div className="card-sub">
            Historical runs are read-only · workbooks and summaries remain
            available
          </div>
        </div>
      </div>
      <div
        style={{
          padding: 0,
          maxHeight: SCROLL_BODY_MAX_HEIGHT,
          overflowY: 'auto',
        }}
      >
        {isLoading && (
          <div
            style={{
              padding: '12px 16px',
              fontSize: 12.5,
              color: 'var(--ink-400)',
            }}
          >
            Loading previous runs&hellip;
          </div>
        )}
        {!isLoading && archivedRuns.length === 0 && (
          <div
            style={{
              padding: '12px 16px',
              fontSize: 12.5,
              color: 'var(--ink-400)',
            }}
          >
            No previous completed runs
          </div>
        )}
        {!isLoading &&
          archivedRuns.map((archivedRun, index) => (
            <div
              key={archivedRun.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 16px',
                borderBottom:
                  index < archivedRuns.length - 1 || hasNextPage
                    ? '1px solid var(--line)'
                    : 'none',
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: 'var(--ink-100)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--ink-600)',
                  flexShrink: 0,
                }}
              >
                <ArchiveIcon width={14} height={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>
                  {archivedRun.label}{' '}
                  <Badge
                    tone={
                      isCompletedRunStatus(archivedRun.status)
                        ? 'success'
                        : 'neutral'
                    }
                    style={{ marginLeft: 8, fontSize: 10 }}
                  >
                    {formatRunStatusLabel(archivedRun.status)}
                  </Badge>
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: 'var(--ink-500)',
                    marginTop: 2,
                  }}
                >
                  {archivedRun.period} · {archivedRun.companies} companies ·{' '}
                  {archivedRun.conviction === null
                    ? '—'
                    : `${archivedRun.conviction}%`}{' '}
                  conviction · {archivedRun.flags ?? '—'} flagged
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    toast('Workbook preview is coming soon', {
                      tone: 'default',
                    })
                  }
                >
                  <XlsIcon width={12} height={12} />
                  View Workbooks
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    toast('Summary preview is coming soon', { tone: 'default' })
                  }
                >
                  <LayersIcon width={12} height={12} />
                  View Summary
                </button>
              </div>
            </div>
          ))}
        {!isLoading && hasNextPage && (
          <div
            ref={sentinelRef}
            style={{
              padding: '10px 16px',
              fontSize: 12.5,
              color: 'var(--ink-400)',
            }}
          >
            {isFetchingNextPage && 'Loading more...'}
          </div>
        )}
      </div>
    </div>
  );
};
