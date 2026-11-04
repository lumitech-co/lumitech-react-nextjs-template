/**
 * Generator contract: what `generate:entity` and `generate:feature` produce
 * must pass lint and tsc as generated. Scaffolds a throwaway slice, checks,
 * then restores.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const WIRED_FILE = 'src/shared/constants/query-keys.ts';
const SLICES = ['src/entities/generator-probe', 'src/features/generator-probe'];

const run = command => {
  console.log(`\n$ ${command}`);

  return spawnSync(command, { shell: true, stdio: 'inherit' }).status === 0;
};

const backup = fs.readFileSync(WIRED_FILE, 'utf8');
let passed = false;

try {
  passed = [
    'npm run generate:entity generatorProbe',
    'npm run generate:feature generatorProbe',
    `npx eslint --max-warnings 0 --no-error-on-unmatched-pattern ${SLICES.join(' ')} ${WIRED_FILE}`,
    'npx tsc --noEmit',
  ].every(run);
} finally {
  SLICES.forEach(slice => fs.rmSync(slice, { recursive: true, force: true }));
  fs.writeFileSync(WIRED_FILE, backup);
}

console.log(
  passed
    ? '\n✅ Generated code passes lint and tsc.'
    : "\n❌ Generated code breaks the template's rules — fix the generator (CLAUDE.md, Rule 0).",
);

process.exitCode = passed ? 0 : 1;
