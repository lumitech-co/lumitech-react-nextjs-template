export const normalizeDomain = (value: string): string => {
  let domain = value.trim();

  domain = domain.replace(/^https?:\/\//i, '');
  [domain] = domain.split('/');
  [domain] = domain.split('?');
  [domain] = domain.split('#');
  domain = domain.replace(/^www\./i, '');

  return domain.replace(/\.$/, '');
};

export const toWebsiteUrl = (
  domain: string | null | undefined,
): string | null => {
  if (!domain?.trim()) {
    return null;
  }

  const normalized = normalizeDomain(domain);

  return normalized ? `https://${normalized}` : null;
};
