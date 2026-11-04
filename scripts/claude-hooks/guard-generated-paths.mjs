/**
 * Claude Code PreToolUse hook (Write/Edit/MultiEdit). Rule 0: entities and
 * features are created by the generators. Files inside an existing slice stay
 * editable.
 */
import fs from 'node:fs';
import path from 'node:path';

const GENERATORS = {
  entities: 'generate:entity',
  features: 'generate:feature',
};

const input = JSON.parse(fs.readFileSync(0, 'utf8'));
const root = process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd();
const filePath = input.tool_input?.file_path;

const relative =
  typeof filePath === 'string'
    ? path
        .relative(root, path.resolve(root, filePath))
        .split(path.sep)
        .join('/')
    : '';

const [, layer, slice] =
  relative.match(/^src\/(entities|features)\/([^/]+)\//) ?? [];

if (layer && !fs.existsSync(path.join(root, 'src', layer, slice))) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: `Rule 0: create the slice with \`npm run ${GENERATORS[layer]} ${slice}\`, then edit the files it produced.`,
      },
    }),
  );
}
