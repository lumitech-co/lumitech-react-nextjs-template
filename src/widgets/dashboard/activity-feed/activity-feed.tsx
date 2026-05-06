import { IActivityItem } from 'shared/api';
import {
  AlertIcon,
  CheckIcon,
  PlayIcon,
  SparkleIcon,
  UploadIcon,
} from 'shared/icons';

interface IActivityFeedProps {
  items: IActivityItem[];
}

const ICON_MAP: Record<string, React.FC<React.SVGProps<SVGElement>>> = {
  sparkle: SparkleIcon,
  alert: AlertIcon,
  check: CheckIcon,
  upload: UploadIcon,
  play: PlayIcon,
};

const TONE_MAP: Record<string, string> = {
  warning: 'var(--warning)',
  success: 'var(--success)',
  danger: 'var(--danger)',
};

export const ActivityFeed = ({ items }: IActivityFeedProps) => (
  <div className="card">
    <div className="card-header">
      <div className="card-title">Activity</div>
    </div>
    <div className="card-body" style={{ padding: 0 }}>
      {items.map((activity, index) => {
        const IconComponent = ICON_MAP[activity.iconName] || SparkleIcon;
        const iconColor = activity.tone
          ? TONE_MAP[activity.tone] || 'var(--ink-700)'
          : 'var(--ink-700)';

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
              <div style={{ fontSize: 12.5 }}>{activity.text}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-400)' }}>
                {activity.time}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
