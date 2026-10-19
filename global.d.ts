import type { routing } from 'shared/lib/i18n/routing';

import type messages from './src/shared/lib/i18n/messages/en.json';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
