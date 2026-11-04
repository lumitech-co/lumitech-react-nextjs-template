import { describe, expect, it } from 'vitest';

import { buildCsp } from 'shared/lib/csp';

describe('buildCsp', () => {
  const csp = buildCsp('abc');

  it('allows scripts only through the nonce', () => {
    expect(csp).toContain("script-src 'self' 'nonce-abc' 'strict-dynamic'");
    expect(csp).not.toContain("'unsafe-inline'");
    expect(csp).not.toContain("'unsafe-eval'");
  });

  it('allows calls to the API origin', () => {
    expect(csp).toContain("connect-src 'self' http://api.test");
  });

  it('blocks framing, plugins and a base tag', () => {
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
  });
});
