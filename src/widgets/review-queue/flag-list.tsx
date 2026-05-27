import { IReviewFlag } from 'shared/api';
import { CheckIcon } from 'shared/icons';
import { cn } from 'shared/lib';

import { FlagListItem } from './flag-list-item';

export type UiFilter = 'all' | 'outlier' | 'low_confidence' | 'missing';

interface Counts {
  all: number;
  outlier: number;
  low_confidence: number;
  missing: number;
}

interface Props {
  flags: IReviewFlag[];
  filter: UiFilter;
  counts: Counts;
  selectedId: string | undefined;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onFilterChange: (filter: UiFilter) => void;
  onSelectFlag: (id: string) => void;
  onLoadMore: () => void;
}

export const FlagList = ({
  flags,
  filter,
  counts,
  selectedId,
  hasNextPage,
  isFetchingNextPage,
  onFilterChange,
  onSelectFlag,
  onLoadMore,
}: Props) => (
  <div className="flex min-h-0 flex-col border-r border-line">
    <div className="tabs px-2">
      <div
        className={cn('tab', filter === 'all' && 'active')}
        onClick={() => onFilterChange('all')}
      >
        All <span className="count">{counts.all}</span>
      </div>
      <div
        className={cn('tab', filter === 'outlier' && 'active')}
        onClick={() => onFilterChange('outlier')}
      >
        Outlier <span className="count">{counts.outlier}</span>
      </div>
      <div
        className={cn('tab', filter === 'low_confidence' && 'active')}
        onClick={() => onFilterChange('low_confidence')}
      >
        Low conf. <span className="count">{counts.low_confidence}</span>
      </div>
      <div
        className={cn('tab', filter === 'missing' && 'active')}
        onClick={() => onFilterChange('missing')}
      >
        Missing <span className="count">{counts.missing}</span>
      </div>
    </div>

    <div className="flex-1 overflow-auto">
      {flags.length === 0 ? (
        <div className="empty">
          <CheckIcon width={28} height={28} className="mb-2 text-success" />
          <div className="empty-title">All clear</div>
          <div>No flagged items in this view.</div>
        </div>
      ) : (
        <>
          {flags.map(flag => (
            <FlagListItem
              key={flag.id}
              flag={flag}
              isSelected={flag.id === selectedId}
              onClick={() => onSelectFlag(flag.id)}
            />
          ))}
          {hasNextPage && (
            <div className="p-3 text-center">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={isFetchingNextPage}
                onClick={onLoadMore}
              >
                {isFetchingNextPage ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
