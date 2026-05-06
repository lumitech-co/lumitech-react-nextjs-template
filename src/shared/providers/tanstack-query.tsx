'use client';

import { PropsWithChildren } from 'react';

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from 'shared/lib';
import { ToastProvider } from 'shared/ui';

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
  if (isServer) {
    return queryClient;
  }

  if (!browserQueryClient) {
    browserQueryClient = queryClient;
  }

  return browserQueryClient;
};

export const TanStackQueryProvider = ({ children }: PropsWithChildren) => {
  const client = getQueryClient();

  return (
    <QueryClientProvider client={client}>
      <ToastProvider>{children}</ToastProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
