'use client';

import { ActivityType, IActivityItemResponse } from 'shared/api';
import {
  AlertIcon,
  CheckIcon,
  PlayIcon,
  SparkleIcon,
  UploadIcon,
} from 'shared/icons';
import { cn, useInfiniteScroll } from 'shared/lib';

interface IActivityFeedProps {
  items: IActivityItemResponse[];
  isLoading?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

const ICON_MAP: Record<ActivityType, React.FC<React.SVGProps<SVGElement>>> = {
  run_started: PlayIcon,
  report_uploaded: UploadIcon,
  extraction_completed: SparkleIcon,
  flag_raised: AlertIcon,
  workbook_generated: CheckIcon,
};

const TONE_CLASS: Record<ActivityType, string> = {
  run_started: 'text-ink-700',
  report_uploaded: 'text-ink-700',
  extraction_completed: 'text-success',
  flag_raised: 'text-warning',
  workbook_generated: 'text-success',
};

const formatRelativeTime = (isoDate: string): string => {
  const timestamp = new Date(isoDate).getTime();
  const diffMs = Date.now() - timestamp;

  if (Number.isNaN(timestamp)) {
    return isoDate;
  }

  const minuteMs = 60_000;
  const hourMs = 60 * minuteMs;
  const hoursPerDay = 24;
  const dayMs = hoursPerDay * hourMs;

  if (diffMs < minuteMs) {
    return 'Just now';
  }

  if (diffMs < hourMs) {
    const minutes = Math.floor(diffMs / minuteMs);

    return `${minutes} min ago`;
  }

  if (diffMs < dayMs) {
    const hours = Math.floor(diffMs / hourMs);

    return `${hours} hr ago`;
  }

  const days = Math.floor(diffMs / dayMs);

  return `${days} day${days === 1 ? '' : 's'} ago`;
};

export const ActivityFeed = ({
  items,
  isLoading = false,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: IActivityFeedProps) => {
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: onLoadMore,
  });

  return (
    <div className="card flex h-[370px] flex-col">
      <div className="card-header shrink-0">
        <div className="card-title">Activity</div>
      </div>
      <div className="card-body min-h-0 flex-1 overflow-y-auto p-0">
        {isLoading && (
          <div className="p-4 text-[12.5px] text-ink-400">
            Loading activity&hellip;
          </div>
        )}
        {!isLoading && items.length === 0 && (
          <div className="p-4 text-[12.5px] text-ink-400">No activity yet</div>
        )}
        {!isLoading &&
          items.map((activity, index) => {
            const IconComponent = ICON_MAP[activity.type] ?? SparkleIcon;
            const iconToneClass = TONE_CLASS[activity.type];

            return (
              <div
                key={activity.id}
                className={cn(
                  'flex gap-2.5 px-4 py-2.5',
                  index < items.length - 1 && 'border-b border-line',
                )}
              >
                <div
                  className={cn(
                    'grid size-6 shrink-0 place-items-center rounded-md bg-ink-100',
                    iconToneClass,
                  )}
                >
                  <IconComponent width={12} height={12} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px]">{activity.description}</div>
                  <div className="text-[11px] text-ink-400">
                    {formatRelativeTime(activity.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
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
