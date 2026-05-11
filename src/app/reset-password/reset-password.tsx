'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { ResetPasswordScreen, useAuthStore } from 'features';
import { BrandPanel } from 'widgets';

export const ResetPasswordView = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    if (isAuthenticated) {
      router.replace('/dashboard');

      return;
    }

    if (!token) {
      router.replace('/sign-in');
    }
  }, [hasMounted, isAuthenticated, token, router]);

  if (!hasMounted || isAuthenticated || !token) {
    return null;
  }

  return (
    <ResetPasswordScreen
      leftPanel={<BrandPanel />}
      resetPasswordToken={token}
    />
  );
};
