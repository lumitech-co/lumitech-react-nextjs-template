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
    <StatGrid className="mb-4">
      <Stat label="Universe loaded" delta="Companies in run">
        {stats.screening}
      </Stat>
      <Stat label="Shortlisted" delta="After screening rules">
        {stats.shortlisted}
      </Stat>
      <Stat label="Processed" delta={`${remaining} remaining`}>
        {stats.processedDone}
        <span className="text-sm font-medium text-ink-500">
          {' '}
          / {stats.shortlisted}
        </span>
      </Stat>
      <Stat
        label="Needs review"
        delta={`${stats.needsReviewFlagCount} flagged values`}
      >
        <span className="text-warning">{stats.needsReviewFlagCount}</span>
      </Stat>
      <Stat label="Avg conviction" delta="Across processed companies">
        {convictionLabel}
      </Stat>
    </StatGrid>
  );
};
