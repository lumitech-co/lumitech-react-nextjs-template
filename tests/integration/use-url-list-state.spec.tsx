import type { ReactNode } from 'react';

import { act, renderHook } from '@testing-library/react';
import { NuqsTestingAdapter, type UrlUpdateEvent } from 'nuqs/adapters/testing';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { useUrlListState, zodParam } from 'shared/hooks/use-url-list-state';

const parsers = {
  status: zodParam(z.enum(['all', 'done'])).withDefault('all'),
  page: zodParam(z.coerce.number().positive()).withDefault(1),
};

const renderListState = (
  searchParams: string,
  onUrlUpdate?: (event: UrlUpdateEvent) => void,
) =>
  renderHook(() => useUrlListState(parsers), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <NuqsTestingAdapter
        searchParams={searchParams}
        onUrlUpdate={onUrlUpdate}
        hasMemory
      >
        {children}
      </NuqsTestingAdapter>
    ),
  });

describe('useUrlListState', () => {
  it('reads valid values from the URL', () => {
    const { result } = renderListState('?status=done&page=3');

    expect(result.current[0]).toEqual({ status: 'done', page: 3 });
  });

  it('falls back to the default on an invalid value', () => {
    const { result } = renderListState('?status=hacked&page=-1');

    expect(result.current[0]).toEqual({ status: 'all', page: 1 });
  });

  it('writes with replace and omits a default value', async () => {
    const onUrlUpdate = vi.fn<(event: UrlUpdateEvent) => void>();
    const { result } = renderListState('?page=3', onUrlUpdate);

    await act(() => result.current[1]({ status: 'done', page: 1 }));

    const [event] = onUrlUpdate.mock.calls[0] ?? [];

    expect(event?.queryString).toBe('?status=done');
    expect(event?.options.history).toBe('replace');
    expect(result.current[0]).toEqual({ status: 'done', page: 1 });
  });
});
