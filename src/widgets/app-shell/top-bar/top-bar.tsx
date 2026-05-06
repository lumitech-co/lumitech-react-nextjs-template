'use client';

import { Badge } from 'shared/ui';

interface ITopBarProps {
  runLabel?: string;
  status?: 'idle' | 'running' | 'completed';
}

export const TopBar = ({
  runLabel = 'Iron Blue · Run #2026-04-30-A',
  status = 'idle',
}: ITopBarProps) => (
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
    </div>
  </header>
);
