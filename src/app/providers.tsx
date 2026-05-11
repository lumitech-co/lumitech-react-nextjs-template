'use client';

import { PropsWithChildren } from 'react';

import { authApi } from 'shared/api';
import { setupResponseInterceptor } from 'shared/lib';
import { TanStackQueryProvider } from 'shared/providers';

const refreshToken = async (): Promise<string> => {
  const response = await authApi.refresh();

  return response.data.accessToken;
};

setupResponseInterceptor(refreshToken);

export const Providers = ({ children }: PropsWithChildren) => (
  <TanStackQueryProvider>{children}</TanStackQueryProvider>
);
