/**
 * Strips Domain= so Safari treats refresh_token as first-party on the Next.js host.
 * On HTTP (local dev), strips Secure and downgrades SameSite=None → Lax for Safari compliance.
 */
const transformCookieAttribute = (
  cookiePart: string,
  isSecureContext: boolean,
): string => {
  const trimmed = cookiePart.trim();

  if (/^domain=/i.test(trimmed)) {
    return '';
  }

  if (!isSecureContext) {
    if (/^secure$/i.test(trimmed)) {
      return '';
    }

    if (/^samesite=none$/i.test(trimmed)) {
      return 'SameSite=Lax';
    }
  }

  return trimmed;
};

export const rewriteSetCookieHeader = (
  setCookieValue: string,
  isSecureContext: boolean,
): string => {
  const parts = setCookieValue.split(';');
  const [nameValue, ...attributes] = parts;

  const rewrittenAttributes = attributes
    .map(attribute => transformCookieAttribute(attribute, isSecureContext))
    .filter(attribute => attribute.length > 0);

  return [nameValue.trim(), ...rewrittenAttributes].join('; ');
};

export const rewriteSetCookieHeaders = (
  headers: Headers,
  isSecureContext: boolean,
): Headers => {
  const rewritten = new Headers(headers);
  const setCookieValues = rewritten.getSetCookie?.() ?? [];

  if (setCookieValues.length === 0) {
    const legacyValue = rewritten.get('set-cookie');

    if (!legacyValue) {
      return rewritten;
    }

    rewritten.delete('set-cookie');
    rewritten.append(
      'set-cookie',
      rewriteSetCookieHeader(legacyValue, isSecureContext),
    );

    return rewritten;
  }

  rewritten.delete('set-cookie');

  setCookieValues.forEach(cookieValue => {
    rewritten.append(
      'set-cookie',
      rewriteSetCookieHeader(cookieValue, isSecureContext),
    );
  });

  return rewritten;
};
