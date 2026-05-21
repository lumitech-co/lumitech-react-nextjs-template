'use client';

import { useGetLatestRun } from 'entities';

import { isActiveRunStatus } from 'shared/api';
import { Badge } from 'shared/ui';

type TopBarStatus = 'idle' | 'running' | 'completed';

const getTopBarStatus = (
  status: ReturnType<typeof useGetLatestRun>['data'],
): TopBarStatus => {
  const run = status?.data;

  if (!run) {
    return 'idle';
  }

  if (isActiveRunStatus(run.status)) {
    return 'running';
  }

  if (run.status === 'completed') {
    return 'completed';
  }

  return 'idle';
};

export const TopBar = () => {
  const { data: latestRunResponse } = useGetLatestRun();
  const activeRun = latestRunResponse?.data ?? null;
  const status = getTopBarStatus(latestRunResponse);
  const runLabel = activeRun?.label
    ? `Iron Blue · ${activeRun.label}`
    : 'Iron Blue';

  return (
    <header className="topbar">
      <div>
        <div
          className="text-sm font-semibold tracking-[-0.005em]"
          style={{ color: 'var(--ink-900)' }}
        >
          {runLabel}
        </div>
      </div>
      <div className="topbar-spacer" />
      <div className="row gap-8">
        {status === 'idle' && (
          <Badge tone="neutral" withDot>
            No active run
          </Badge>
        )}
        {status === 'running' && (
          <Badge tone="info" withDot>
            Run in progress
          </Badge>
        )}
        {status === 'completed' && (
          <Badge tone="success" withDot={false}>
            Run completed
          </Badge>
        )}
      </div>
    </header>
  );
};
