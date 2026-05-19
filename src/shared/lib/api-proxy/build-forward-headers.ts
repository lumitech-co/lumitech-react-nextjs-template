const FORWARD_REQUEST_HEADERS = [
  'accept',
  'accept-language',
  'authorization',
  'content-type',
  'cookie',
  'if-match',
  'if-none-match',
  'if-modified-since',
  'if-unmodified-since',
  'user-agent',
] as const;

const getClientIp = (request: Request): string | null => {
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? null;
  }

  return request.headers.get('x-real-ip');
};

export const buildForwardHeaders = (request: Request): Headers => {
  const headers = new Headers();

  FORWARD_REQUEST_HEADERS.forEach(headerName => {
    const value = request.headers.get(headerName);

    if (value) {
      headers.set(headerName, value);
    }
  });

  const clientIp = getClientIp(request);

  if (clientIp) {
    headers.set('x-forwarded-for', clientIp);
  }

  const host = request.headers.get('host');

  if (host) {
    headers.set('x-forwarded-host', host);
  }

  const protocol =
    request.headers.get('x-forwarded-proto') ??
    new URL(request.url).protocol.replace(':', '');

  headers.set('x-forwarded-proto', protocol);

  return headers;
};
