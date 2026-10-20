import { ReactElement } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import messages from 'shared/lib/i18n/messages/en.json';
import { makeQueryClient } from 'shared/lib/query';

/**
 * Renders with a QueryClient created per test, so no cache leaks between them,
 * and the English messages so assertions read the same as the UI.
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
      <NextIntlClientProvider locale="en" messages={messages}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </NextIntlClientProvider>
    ),
    ...options,
  });
};

export * from '@testing-library/react';
