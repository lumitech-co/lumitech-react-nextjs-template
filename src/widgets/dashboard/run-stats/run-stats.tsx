import { IRun } from 'shared/api';
import { Stat, StatGrid } from 'shared/ui';

interface IRunStatsProps {
  run: IRun;
}

export const RunStats = ({ run }: IRunStatsProps) => (
  <StatGrid style={{ marginBottom: 16 }}>
    <Stat label="Universe loaded" delta="STOXX 600 · Apr 30, 2026">
      {run.totals.universe}
    </Stat>
    <Stat label="Shortlisted" delta="After screening rules">
      {run.totals.shortlisted}
    </Stat>
    <Stat
      label="Processed"
      delta={`${run.totals.shortlisted - run.totals.processed} remaining`}
    >
      {run.totals.processed}
      <span style={{ fontSize: 14, color: 'var(--ink-500)', fontWeight: 500 }}>
        {' '}
        / {run.totals.shortlisted}
      </span>
    </Stat>
    <Stat
      label="Needs review"
      delta={`Flagged values across ${Math.ceil(run.totals.needsReview / 2)} companies`} // eslint-disable-line no-magic-numbers
    >
      <span style={{ color: 'var(--warning)' }}>{run.totals.needsReview}</span>
    </Stat>
    <Stat label="Avg conviction" delta="Across processed companies">
      {run.overallConviction}%
    </Stat>
  </StatGrid>
);
