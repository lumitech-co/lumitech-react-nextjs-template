/**
 * Same-origin API base for axios. Empty string = relative /api/* on the Next.js host.
 * Uses process.env directly because Next.js omits empty NEXT_PUBLIC_* vars at build time,
 * which breaks @t3-oss/env-nextjs client validation when NEXT_PUBLIC_API_URL="".
 */
export const getApiBaseUrl = (): string =>
  process.env.NEXT_PUBLIC_API_URL ?? '';
