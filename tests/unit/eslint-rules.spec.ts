// @vitest-environment node
import fs from 'node:fs';

import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

type Case = {
  name: string;
  rule: string;
  file: string;
  code: string;
  reports: boolean;
};

const FEATURE = 'src/features/todos/ui/todo/todo.tsx';
const ENTITY_API = 'src/entities/todos/api/get.ts';
const SHARED = 'src/shared/lib/styles.ts';
const PAGE = 'src/app/[locale]/page.tsx';

/**
 * Every architecture rule fires on a violation and stays quiet on the allowed
 * shape: a selector that silently stops matching leaves lint green on a clean
 * repo. The paths are real files, because typed rules need them in tsconfig.
 */
const CASES: Case[] = [
  {
    name: 'process.env outside env.ts',
    rule: 'no-restricted-properties',
    file: SHARED,
    code: 'export const url = process.env.API_URL;\n',
    reports: true,
  },
  {
    name: 'the env module',
    rule: 'no-restricted-properties',
    file: SHARED,
    code: "import { env } from 'env';\n\nexport const url = env.NEXT_PUBLIC_API_URL;\n",
    reports: false,
  },
  {
    name: 'global fetch',
    rule: 'no-restricted-syntax',
    file: FEATURE,
    code: "export const load = () => fetch('/todos');\n",
    reports: true,
  },
  {
    name: 'window.fetch',
    rule: 'no-restricted-syntax',
    file: FEATURE,
    code: "export const load = () => window.fetch('/todos');\n",
    reports: true,
  },
  {
    name: 'XMLHttpRequest',
    rule: 'no-restricted-syntax',
    file: FEATURE,
    code: 'export const load = () => new XMLHttpRequest();\n',
    reports: true,
  },
  {
    name: 'an unrelated call',
    rule: 'no-restricted-syntax',
    file: FEATURE,
    code: 'const prefetch = () => null;\n\nexport const load = () => prefetch();\n',
    reports: false,
  },
  {
    name: 'an inline query key',
    rule: 'no-restricted-syntax',
    file: SHARED,
    code: "export const options = { queryKey: ['todos'] };\n",
    reports: true,
  },
  {
    name: "'use client' on a page",
    rule: 'no-restricted-syntax',
    file: PAGE,
    code: "'use client';\n\nconst Page = () => null;\n\nexport default Page;\n",
    reports: true,
  },
  {
    name: 'a hook in a page',
    rule: 'no-restricted-syntax',
    file: PAGE,
    code: 'const Page = () => useThing();\n\nexport default Page;\n',
    reports: true,
  },
  {
    name: 'literal JSX text',
    rule: 'react/jsx-no-literals',
    file: FEATURE,
    code: 'export const Todo = () => <p>Hello</p>;\n',
    reports: true,
  },
  {
    name: 'next/link',
    rule: 'no-restricted-imports',
    file: FEATURE,
    code: "import Link from 'next/link';\n\nexport { Link };\n",
    reports: true,
  },
  {
    name: 'a component-level stylesheet',
    rule: 'no-restricted-imports',
    file: FEATURE,
    code: "import './todo.module.css';\n",
    reports: true,
  },
  {
    name: 'the axios client outside an entity',
    rule: 'no-restricted-imports',
    file: FEATURE,
    code: "import { api } from 'shared/lib/axios';\n\nexport { api };\n",
    reports: true,
  },
  {
    name: 'the axios client in an entity',
    rule: 'no-restricted-imports',
    file: ENTITY_API,
    code: "import { api } from 'shared/lib/axios';\n\nexport { api };\n",
    reports: false,
  },
  {
    name: 'a lower layer importing a higher one',
    rule: 'boundaries/dependencies',
    file: SHARED,
    code: "import { Header } from 'features/layout/ui/header/header';\n\nexport { Header };\n",
    reports: true,
  },
  {
    name: 'a feature importing an entity api',
    rule: 'boundaries/dependencies',
    file: FEATURE,
    code: "import { getTodos } from 'entities/todos/api/get';\n\nexport { getTodos };\n",
    reports: true,
  },
  {
    name: 'a feature importing an entity hook',
    rule: 'boundaries/dependencies',
    file: FEATURE,
    code: "import { useGetTodos } from 'entities/todos/hooks/get';\n\nexport { useGetTodos };\n",
    reports: false,
  },
];

const ARCHITECTURE_RULE = /boundaries\/|check-file\/|no-restricted-/;
const THIS_FILE = 'tests/unit/eslint-rules.spec.ts';

const sourceFiles = (dir: string) =>
  fs
    .readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter(file => /\.tsx?$/.test(file))
    .map(file => `${dir}/${file}`.replaceAll('\\', '/'));

describe('architecture lint rules', () => {
  const eslint = new ESLint();

  it.each(CASES)(
    '$rule on $name: reports=$reports',
    async ({ rule, file, code, reports }) => {
      const [result] = await eslint.lintText(code, { filePath: file });
      const fired = result?.messages.some(({ ruleId }) => ruleId === rule);

      expect(fired).toBe(reports);
    },
    60_000,
  );
});

describe('architecture rules are never switched off', () => {
  it('has no blanket or architecture eslint-disable', () => {
    const banned = ['src', 'tests']
      .flatMap(sourceFiles)
      .filter(file => file !== THIS_FILE)
      .flatMap(file =>
        [...fs.readFileSync(file, 'utf8').matchAll(/eslint-disable\S*(.*)/g)]
          .map(([, rules = '']) => rules.replace('*/', '').trim())
          .filter(rules => rules === '' || ARCHITECTURE_RULE.test(rules))
          .map(rules => `${file}: ${rules || 'blanket'}`),
      );

    expect(banned).toEqual([]);
  });
});
