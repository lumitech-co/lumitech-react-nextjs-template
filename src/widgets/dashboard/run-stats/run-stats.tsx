import { IRunStats } from 'shared/api';
import { Stat, StatGrid } from 'shared/ui';

interface IRunStatsProps {
  stats: IRunStats;
}

export const RunStats = ({ stats }: IRunStatsProps) => {
  const remaining = Math.max(stats.shortlisted - stats.processedDone, 0);
  const convictionLabel = stats.avgConvictionPct
    ? `${stats.avgConvictionPct}%`
    : '—';

  return (
    <StatGrid style={{ marginBottom: 16 }}>
      <Stat label="Universe loaded" delta="Companies in run">
        {stats.screening}
      </Stat>
      <Stat label="Shortlisted" delta="After screening rules">
        {stats.shortlisted}
      </Stat>
      <Stat label="Processed" delta={`${remaining} remaining`}>
        {stats.processedDone}
        <span
          style={{ fontSize: 14, color: 'var(--ink-500)', fontWeight: 500 }}
        >
          {' '}
          / {stats.shortlisted}
        </span>
      </Stat>
      <Stat
        label="Needs review"
        delta={`${stats.needsReviewFlagCount} flagged values`}
      >
        <span style={{ color: 'var(--warning)' }}>
          {stats.needsReviewFlagCount}
        </span>
      </Stat>
      <Stat label="Avg conviction" delta="Across processed companies">
        {convictionLabel}
      </Stat>
    </StatGrid>
  );
};
