import { env } from 'env';

/**
 * Dev tooling needs what production must not allow: React's `eval`, the HMR
 * socket and the style tags of the dev overlay.
 */
export const buildCsp = (nonce: string) => {
  const isDevelopment = env.NODE_ENV === 'development';

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' ${isDevelopment ? "'unsafe-inline'" : `'nonce-${nonce}'`}`,
    `connect-src 'self' ${new URL(env.NEXT_PUBLIC_API_URL).origin}${isDevelopment ? ' ws:' : ''}`,
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
};
