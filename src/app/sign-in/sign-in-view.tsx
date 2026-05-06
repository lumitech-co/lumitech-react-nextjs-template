'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { SignInScreen, useAuthStore } from 'features';
import { BrandPanel } from 'widgets';

export const SignInView = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get('expired') === '1';
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [hasMounted, isAuthenticated, router]);

  if (!hasMounted || isAuthenticated) {
    return null;
  }

  return (
    <SignInScreen leftPanel={<BrandPanel />} sessionExpired={sessionExpired} />
  );
};
