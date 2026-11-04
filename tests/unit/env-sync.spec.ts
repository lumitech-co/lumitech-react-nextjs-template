// @vitest-environment node
import fs from 'node:fs';

import { describe, expect, it } from 'vitest';

const keysOf = (source: string) =>
  [...source.matchAll(/^\s*([A-Z][A-Z0-9_]*)\s*[:=]/gm)]
    .map(([, key]) => key)
    .filter(key => key !== 'NODE_ENV')
    .sort();

const [schema = '', runtimeEnv = ''] = fs
  .readFileSync('src/env.ts', 'utf8')
  .split('runtimeEnv:');

const schemaKeys = keysOf(schema);

describe('Rule 1: env.ts and .env.example agree', () => {
  it('finds keys, so an empty scan cannot pass', () => {
    expect(schemaKeys.length).toBeGreaterThan(0);
  });

  it('maps every schema key in runtimeEnv', () => {
    expect(keysOf(runtimeEnv)).toEqual(schemaKeys);
  });

  it('lists every schema key in .env.example', () => {
    expect(keysOf(fs.readFileSync('.env.example', 'utf8'))).toEqual(schemaKeys);
  });
});
