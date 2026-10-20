import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { routing } from 'shared/lib/i18n/routing';

const MESSAGES_DIR = join(__dirname, '../../src/shared/lib/i18n/messages');

const readMessages = (file: string) =>
  JSON.parse(readFileSync(join(MESSAGES_DIR, file), 'utf-8'));

const flattenKeys = (node: unknown, prefix = ''): string[] =>
  typeof node === 'object' && node !== null
    ? Object.entries(node).flatMap(([key, value]) =>
        flattenKeys(value, prefix ? `${prefix}.${key}` : key),
      )
    : [prefix];

describe('i18n messages', () => {
  const sourceKeys = flattenKeys(readMessages(`${routing.defaultLocale}.json`)).sort();

  it('has a messages file for every locale and no extra ones', () => {
    const files = readdirSync(MESSAGES_DIR).filter(file => file.endsWith('.json'));

    expect(files.sort()).toEqual(routing.locales.map(locale => `${locale}.json`).sort());
  });

  it.each(routing.locales)('%s.json has exactly the same keys as the default locale', locale => {
    expect(flattenKeys(readMessages(`${locale}.json`)).sort()).toEqual(sourceKeys);
  });
});
