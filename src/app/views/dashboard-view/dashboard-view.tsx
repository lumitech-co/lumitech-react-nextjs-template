'use client';

import { useCallback } from 'react';

import { AppShell, Dashboard } from 'widgets';

export const DashboardView = () => {
  const handleGoto = useCallback((_route: string) => {
    // No-op — routing to other pages not implemented yet
  }, []);

  return (
    <AppShell>
      <Dashboard goto={handleGoto} />
    </AppShell>
  );
};
