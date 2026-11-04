import type { Locale } from 'next-intl';

import { getPathname } from './navigation';
import { routing } from './routing';

/** The hreflang links of a page, relative to `metadataBase`. */
export const getLanguages = (href: string) =>
  Object.fromEntries(
    routing.locales.map(locale => [locale, getPathname({ href, locale })]),
  );

export const getAlternates = (href: string, locale: Locale) => ({
  canonical: getPathname({ href, locale }),
  languages: {
    ...getLanguages(href),
    'x-default': getPathname({ href, locale: routing.defaultLocale }),
  },
});
