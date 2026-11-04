import type { MetadataRoute } from 'next';

import { env } from 'env';

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: '*', allow: '/' },
  sitemap: new URL('/sitemap.xml', env.NEXT_PUBLIC_SITE_URL).href,
});

export default robots;
