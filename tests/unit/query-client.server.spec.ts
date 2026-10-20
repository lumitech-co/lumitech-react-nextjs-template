/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest';

import { getQueryClient } from 'shared/lib/query';

describe('getQueryClient on the server', () => {
  it('builds a fresh client per render so caches never leak between requests', () => {
    expect(getQueryClient()).not.toBe(getQueryClient());
  });
});
