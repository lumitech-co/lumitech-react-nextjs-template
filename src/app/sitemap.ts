import type { MetadataRoute } from 'next';

import { env } from 'env';

import { getLanguages } from 'shared/lib/i18n/alternates';

const PAGES = ['/'];

const absolute = (pathname: string) =>
  new URL(pathname, env.NEXT_PUBLIC_SITE_URL).href;

const sitemap = (): MetadataRoute.Sitemap =>
  PAGES.map(page => {
    const languages = Object.entries(getLanguages(page));

    return {
      url: absolute(page),
      alternates: {
        languages: Object.fromEntries(
          languages.map(([locale, pathname]) => [locale, absolute(pathname)]),
        ),
      },
    };
  });

export default sitemap;
