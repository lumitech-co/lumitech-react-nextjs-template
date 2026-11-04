'use client';

import type { ComponentProps } from 'react';

import { NextIntlClientProvider } from 'next-intl';

import { RouteError } from 'features/layout/ui/route-error/route-error';
import messages from 'shared/lib/i18n/messages/en.json';
import { routing } from 'shared/lib/i18n/routing';

import 'app/styles/global.css';

/**
 * Replaces the root layout, so it renders outside every provider and has no
 * locale to read: it brings its own messages, in the default locale.
 */
const GlobalError = (props: ComponentProps<typeof RouteError>) => (
  <html lang={routing.defaultLocale}>
    <body>
      <NextIntlClientProvider
        locale={routing.defaultLocale}
        messages={messages}
      >
        <RouteError {...props} />
      </NextIntlClientProvider>
    </body>
  </html>
);

export default GlobalError;
