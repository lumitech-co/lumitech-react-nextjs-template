import { ReactElement } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';

import { makeQueryClient } from 'shared/lib/query';

/**
 * Renders with a QueryClient created per test, so no cache leaks between them.
 * Always render through this helper rather than RTL's bare `render` — entity
 * hooks read the client from context and will throw without a provider.
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const queryClient = makeQueryClient();

  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    ...options,
  });
};

export * from '@testing-library/react';
