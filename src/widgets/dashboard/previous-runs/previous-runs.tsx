'use client';

import { IArchivedRun, isCompletedRunStatus } from 'shared/api';
import { ArchiveIcon, LayersIcon, XlsIcon } from 'shared/icons';
import { cn, useInfiniteScroll } from 'shared/lib';
import { Badge, useToast } from 'shared/ui';

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
    <div className="card mt-4">
      <div className="card-header between">
        <div>
          <div className="card-title">Previous Runs</div>
          <div className="card-sub">
            Historical runs are read-only · workbooks and summaries remain
            available
          </div>
        </div>
      </div>
      <div className="max-h-[320px] overflow-y-auto p-0">
        {isLoading && (
          <div className="px-4 py-3 text-[12.5px] text-ink-400">
            Loading previous runs&hellip;
          </div>
        )}
        {!isLoading && archivedRuns.length === 0 && (
          <div className="px-4 py-3 text-[12.5px] text-ink-400">
            No previous completed runs
          </div>
        )}
        {!isLoading &&
          archivedRuns.map((archivedRun, index) => (
            <div
              key={archivedRun.id}
              className={cn(
                'flex items-center gap-3.5 px-4 py-3',
                (index < archivedRuns.length - 1 || hasNextPage) &&
                  'border-b border-line',
              )}
            >
              <div className="grid size-[34px] shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-500">
                <ArchiveIcon width={14} height={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-semibold">
                  {archivedRun.label}{' '}
                  <Badge
                    tone={
                      isCompletedRunStatus(archivedRun.status)
                        ? 'success'
                        : 'neutral'
                    }
                    className="ml-2 text-[10px]"
                  >
                    {formatRunStatusLabel(archivedRun.status)}
                  </Badge>
                </div>
                <div className="mt-0.5 text-[11.5px] text-ink-500">
                  {archivedRun.period} · {archivedRun.companies} companies ·{' '}
                  {archivedRun.conviction === null
                    ? '—'
                    : `${archivedRun.conviction}%`}{' '}
                  conviction · {archivedRun.flags ?? '—'} flagged
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5">
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
            className="px-4 py-2.5 text-[12.5px] text-ink-400"
          >
            {isFetchingNextPage && 'Loading more...'}
          </div>
        )}
      </div>
    </div>
  );
};
