// @vitest-environment node
import { spawnSync } from 'node:child_process';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const runHook = (script: string, filePath: string) =>
  spawnSync(process.execPath, [path.join('scripts/claude-hooks', script)], {
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: process.cwd() },
    input: JSON.stringify({ tool_input: { file_path: filePath } }),
  });

const guard = (filePath: string) => {
  const result = runHook('guard-generated-paths.mjs', filePath);

  expect(result.status).toBe(0);

  return result.stdout;
};

describe('guard-generated-paths hook', () => {
  it.each(['src/entities/orders/api/get.ts', 'src/features/orders/ui/a.tsx'])(
    'denies %s in a slice that does not exist',
    filePath => {
      expect(guard(filePath)).toContain('"permissionDecision":"deny"');
    },
  );

  it.each([
    'src/entities/todos/api/get.ts',
    'src/features/todos/ui/new-file.tsx',
    'src/shared/lib/new-file.ts',
    'README.md',
  ])('allows %s', filePath => {
    expect(guard(filePath)).toBe('');
  });

  it('denies an absolute path too', () => {
    const absolute = path.resolve('src/features/orders/ui/a.tsx');

    expect(guard(absolute)).toContain('"permissionDecision":"deny"');
  });
});

describe('lint-edited-file hook', () => {
  it('stays quiet on a clean file', () => {
    const result = runHook('lint-edited-file.mjs', 'src/shared/lib/styles.ts');

    expect(result.status).toBe(0);
    expect(result.stdout).toBe('');
  }, 60_000);

  it('skips a file outside the linted folders', () => {
    const result = runHook('lint-edited-file.mjs', 'README.md');

    expect(result.status).toBe(0);
    expect(result.stdout).toBe('');
  });
});
