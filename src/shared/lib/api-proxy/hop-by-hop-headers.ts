/** Hop-by-hop headers must not be forwarded between client ↔ proxy ↔ upstream. */
const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
]);

export const stripHopByHopHeaders = (headers: Headers): Headers => {
  const sanitized = new Headers(headers);

  HOP_BY_HOP_HEADERS.forEach(headerName => {
    sanitized.delete(headerName);
  });

  return sanitized;
};
