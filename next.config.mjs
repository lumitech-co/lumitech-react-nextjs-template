import { fileURLToPath } from 'node:url';

import createNextIntlPlugin from 'next-intl/plugin';

import { createJiti } from 'jiti';

const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files
await jiti.import('./src/env');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // `next dev` would write an AGENTS.md; CLAUDE.md is this repo's agent guide.
  agentRules: false,
  poweredByHeader: false,
  headers: async () => [{ source: '/:path*', headers: securityHeaders }],
  turbopack: {
    rules: {
      // *.svg imports become React components; *.svg?url stays a file URL.
      '*.svg': {
        condition: { not: { query: /[?&]url(?=&|$)/ } },
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

const withNextIntl = createNextIntlPlugin('./src/shared/lib/i18n/request.ts');

export default withNextIntl(nextConfig);
