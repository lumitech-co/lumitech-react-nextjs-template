import { stripHopByHopHeaders } from './hop-by-hop-headers';
import { rewriteSetCookieHeaders } from './rewrite-set-cookie';

export const buildResponseHeaders = (
  upstreamHeaders: Headers,
  isSecureContext: boolean,
): Headers => {
  const headers = stripHopByHopHeaders(new Headers(upstreamHeaders));

  return rewriteSetCookieHeaders(headers, isSecureContext);
};
