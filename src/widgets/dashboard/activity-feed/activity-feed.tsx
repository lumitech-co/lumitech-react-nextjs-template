'use client';

import { ActivityType, IActivityItemResponse } from 'shared/api';
import {
  AlertIcon,
  CheckIcon,
  PlayIcon,
  SparkleIcon,
  UploadIcon,
} from 'shared/icons';
import { useInfiniteScroll } from 'shared/lib';

import { DASHBOARD_PANEL_HEIGHT } from '../constants';

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

const TONE_MAP: Record<ActivityType, string | undefined> = {
  run_started: undefined,
  report_uploaded: undefined,
  extraction_completed: 'var(--success)',
  flag_raised: 'var(--warning)',
  workbook_generated: 'var(--success)',
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
    <div
      className="card flex flex-col"
      style={{ height: DASHBOARD_PANEL_HEIGHT }}
    >
      <div className="card-header shrink-0">
        <div className="card-title">Activity</div>
      </div>
      <div
        className="card-body min-h-0 flex-1 overflow-y-auto"
        style={{ padding: 0 }}
      >
        {isLoading && (
          <div
            style={{ padding: '16px', fontSize: 12.5, color: 'var(--ink-400)' }}
          >
            Loading activity&hellip;
          </div>
        )}
        {!isLoading && items.length === 0 && (
          <div
            style={{ padding: '16px', fontSize: 12.5, color: 'var(--ink-400)' }}
          >
            No activity yet
          </div>
        )}
        {!isLoading &&
          items.map((activity, index) => {
            const IconComponent = ICON_MAP[activity.type] ?? SparkleIcon;
            const iconColor = TONE_MAP[activity.type] ?? 'var(--ink-700)';

            return (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '10px 16px',
                  borderBottom:
                    index < items.length - 1 ? '1px solid var(--line)' : 'none',
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: 'var(--ink-100)',
                    display: 'grid',
                    placeItems: 'center',
                    color: iconColor,
                    flexShrink: 0,
                  }}
                >
                  <IconComponent width={12} height={12} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 12.5 }}>{activity.description}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-400)' }}>
                    {formatRelativeTime(activity.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        {!isLoading && hasNextPage && (
          <div
            ref={sentinelRef}
            style={{
              padding: '10px 16px',
              fontSize: 12.5,
              color: 'var(--ink-400)',
            }}
          >
            {isFetchingNextPage && 'Loading more\u2026'}
          </div>
        )}
      </div>
    </div>
  );
};
