import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

import { buildCsp } from 'shared/lib/csp';
import { routing } from 'shared/lib/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

/**
 * Next reads the nonce from the request's CSP header and stamps it on its own
 * scripts; the root layout reads `x-nonce` for the ones the app renders itself.
 */
const proxy = (request: NextRequest) => {
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce);

  request.headers.set('x-nonce', nonce);
  request.headers.set('Content-Security-Policy', csp);

  const response = handleI18nRouting(request);

  response.headers.set('Content-Security-Policy', csp);

  return response;
};

export default proxy;

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
