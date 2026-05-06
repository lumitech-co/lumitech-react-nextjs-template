'use client';

import { ReactNode, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useAuthStore } from 'features';
import { AppShell } from 'widgets';

type Props = {
  children: ReactNode;
};

const AuthenticatedLayout = ({ children }: Props) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isAuthenticated) {
      router.replace('/sign-in');
    }
  }, [hasMounted, isAuthenticated, router]);

  if (!hasMounted || !isAuthenticated) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
};

export default AuthenticatedLayout;
