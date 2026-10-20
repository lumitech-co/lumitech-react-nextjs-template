import { describe, expect, it } from 'vitest';

import { cn } from 'shared/lib/styles';

describe('cn', () => {
  it('lets the last tailwind class win', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, null, 'c')).toBe('a c');
  });
});
