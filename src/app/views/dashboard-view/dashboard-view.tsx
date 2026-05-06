'use client';

import { AppShell } from 'widgets';

export const DashboardView = () => (
  <AppShell>
    <div className="page-header">
      <div className="page-title">Dashboard</div>
      <div className="page-sub">
        Run-level overview of the latest STOXX 600 coverage cycle.
      </div>
    </div>
    <div
      className="rounded-lg border bg-surface p-6"
      style={{
        borderColor: 'var(--line)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <p className="text-sm" style={{ color: 'var(--ink-500)' }}>
        Dashboard widgets land in the next iteration.
      </p>
    </div>
  </AppShell>
);
