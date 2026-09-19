import { describe, expect, it } from 'vitest';

import { getQueryClient, makeQueryClient } from 'shared/lib/query';

describe('getQueryClient in the browser', () => {
  it('reuses one client so re-renders keep the cache', () => {
    expect(getQueryClient()).toBe(getQueryClient());
  });
});

describe('makeQueryClient', () => {
  it('always builds a separate client', () => {
    expect(makeQueryClient()).not.toBe(makeQueryClient());
  });

  it('applies the template defaults', () => {
    const { queries } = makeQueryClient().getDefaultOptions();

    expect(queries?.staleTime).toBe(60 * 60 * 1000);
    expect(queries?.retry).toBe(false);
  });
});
