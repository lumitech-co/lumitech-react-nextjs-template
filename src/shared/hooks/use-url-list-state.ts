'use client';

import { createParser, useQueryStates, type UseQueryStatesKeysMap } from 'nuqs';
import type { z } from 'zod';

/**
 * Rule 4: a search param is untrusted input, so it is parsed by a Zod schema.
 * An invalid value reads as absent and falls back to `.withDefault(...)`.
 */
export const zodParam = <Output extends NonNullable<unknown>>(
  schema: z.ZodType<Output>,
) =>
  createParser<Output>({
    parse: value => schema.safeParse(value).data ?? null,
    serialize: String,
  });

/**
 * List state (search, sort, tab, filters) lives in the URL, so a list can be
 * shared and survives a reload. Define `parsers` at module scope. Writes replace
 * the history entry, so Back leaves the screen instead of undoing each filter.
 */
export const useUrlListState = <Parsers extends UseQueryStatesKeysMap>(
  parsers: Parsers,
) => useQueryStates(parsers, { history: 'replace' });
