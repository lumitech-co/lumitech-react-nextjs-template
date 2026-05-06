'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { SignInScreen, useAuthStore } from 'features';
import { BrandPanel } from 'widgets';

import { DashboardView } from '../dashboard-view';

export const HomeView = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get('expired') === '1';

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <SignInScreen
        leftPanel={<BrandPanel />}
        sessionExpired={sessionExpired}
      />
    );
  }

  return <DashboardView />;
};
