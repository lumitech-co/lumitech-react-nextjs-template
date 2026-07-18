const path = require('path');

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:@next/next/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: ['tsconfig.json'],
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    // FSD layers, relative to `src`. `slice`/`segment` are captured so
    // policies below can compare "same slice" (e.g. features/todos -> features/todos).
    // Every file under `src` must match exactly one of these — see `boundaries/no-unknown-files`
    // below, which is what actually forbids creating folders outside this list.
    'boundaries/root-path': path.resolve(__dirname, 'src'),
    // File (not folder) descriptor, so `src/env.ts` counts as "known" for
    // `boundaries/no-unknown-files` without being a folder-based element.
    'boundaries/files': [{ pattern: 'env.ts', category: 'env' }],
    // Every element pattern is scoped down to its documented segments (not just
    // `<layer>/*`) — a file in an undeclared segment (e.g. `entities/todos/ui/`,
    // `features/todos/store/`) matches no element and gets caught by
    // `boundaries/no-unknown-files` just like a stray top-level folder would.
    'boundaries/elements': [
      { type: 'app', pattern: 'app/**', partialMatch: false },
      {
        // No `schemas` segment here: forms/validation live in `features`, not `widgets`.
        type: 'widgets',
        pattern: 'widgets/*/(ui|hooks|lib|types)/**',
        capture: ['slice'],
      },
      {
        type: 'features',
        pattern: 'features/*/(ui|hooks|schemas|lib|types)/**',
        capture: ['slice'],
      },
      {
        // No `ui` segment: entities are API-only (see rule 3 in CLAUDE.md).
        type: 'entities',
        pattern: 'entities/*/(api|hooks|types)/**',
        capture: ['slice'],
      },
      {
        // No `api` segment: every API call belongs to an entity (see rule 3 in CLAUDE.md).
        type: 'shared',
        pattern:
          'shared/(ui|types|store|providers|lib|icons|hooks|constants)/**',
        capture: ['segment'],
      },
    ],
  },
  plugins: ['react', '@typescript-eslint', 'boundaries', 'check-file'],
  rules: {
    // Every file in `src` must belong to one of the `boundaries/elements` above —
    // this is what actually blocks creating a stray folder like `src/utils/` or
    // `src/shared/api/`.
    'boundaries/no-unknown-files': 'error',
    // File/folder naming is kebab-case everywhere in `src`, e.g. `create-todo-form.tsx`,
    // `entities/todos/`. `src/app/**` gets Next.js's own App Router case instead, since it
    // has its own conventions (`[id]`, `(group)`, `@slot`) that aren't plain kebab-case.
    'check-file/filename-naming-convention': [
      'error',
      { 'src/**/*.{ts,tsx}': 'KEBAB_CASE' },
      { ignoreMiddleExtensions: true },
    ],
    'check-file/folder-naming-convention': [
      'error',
      {
        'src/app/**/': 'NEXT_JS_APP_ROUTER_CASE',
        'src/!(app)/**/': 'KEBAB_CASE',
      },
    ],
    // FSD layer rule: app -> widgets -> features -> entities -> shared.
    // A layer may only import itself (same slice) and layers strictly below it;
    // `shared` has no slices and its segments may freely import each other.
    'boundaries/dependencies': [
      'error',
      {
        default: 'disallow',
        policies: [
          {
            from: { element: { type: 'shared' } },
            allow: {
              to: [
                { element: { type: 'shared' } },
                { file: { categories: 'env' } },
              ],
            },
            message: '"shared" may only import other "shared" segments and "env".',
          },
          {
            from: { element: { type: 'entities' } },
            allow: {
              to: [
                {
                  element: {
                    type: 'entities',
                    captured: { slice: '{{ from.element.captured.slice }}' },
                  },
                },
                { element: { type: 'shared' } },
                { file: { categories: 'env' } },
              ],
            },
            message:
              '"entities" may only import their own slice, "shared" and "env" — not other entities, features, widgets or app.',
          },
          {
            from: { element: { type: 'features' } },
            allow: {
              to: [
                {
                  element: {
                    type: 'features',
                    captured: { slice: '{{ from.element.captured.slice }}' },
                  },
                },
                { element: { type: 'entities' } },
                { element: { type: 'shared' } },
                { file: { categories: 'env' } },
              ],
            },
            message:
              '"features" may only import their own slice, "entities", "shared" and "env" — not other features, widgets or app.',
          },
          {
            from: { element: { type: 'widgets' } },
            allow: {
              to: [
                {
                  element: {
                    type: 'widgets',
                    captured: { slice: '{{ from.element.captured.slice }}' },
                  },
                },
                { element: { type: 'features' } },
                { element: { type: 'entities' } },
                { element: { type: 'shared' } },
                { file: { categories: 'env' } },
              ],
            },
            message:
              '"widgets" may only import their own slice, "features", "entities", "shared" and "env" — not other widgets or app.',
          },
          {
            from: { element: { type: 'app' } },
            allow: {
              to: [
                { element: { type: 'app' } },
                { element: { type: 'widgets' } },
                { element: { type: 'features' } },
                { element: { type: 'entities' } },
                { element: { type: 'shared' } },
                { file: { categories: 'env' } },
              ],
            },
            message: '"app" may import from any layer below it.',
          },
        ],
      },
    ],
    // Barrel files (`export * from`, `export { x } from`) are forbidden: they hurt
    // tree-shaking/build times in Next.js and hide real import paths. Always import
    // (and export) directly from the file that declares the symbol.
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'ForOfStatement',
        message:
          'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
      {
        selector: 'ExportAllDeclaration',
        message:
          'Barrel re-exports ("export * from \'...\'") are forbidden. Import directly from the file that declares the symbol.',
      },
      {
        selector: 'ExportNamedDeclaration[source]',
        message:
          'Re-exporting from another module ("export { x } from \'...\'") is forbidden — it creates a barrel. Import directly from the source file instead.',
      },
    ],
    // process.env is only allowed in src/env.ts (see the `overrides` block below) —
    // everywhere else, import the validated `env` object instead.
    'no-restricted-properties': [
      'error',
      {
        object: 'process',
        property: 'env',
        message:
          'Do not read process.env directly — add the variable to src/env.ts and import `env` from there instead.',
      },
    ],
    // Styling is Tailwind-only. The single exception is app/styles/global.css (Tailwind
    // directives + shadcn/ui-style CSS variables in @layer base). A stylesheet shipped by a
    // library must be imported straight from the package (e.g. `import 'swiper/css'`), never
    // copied into src/ — those bare package specifiers don't match the patterns below.
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              'app/**/*.css',
              'widgets/**/*.css',
              'features/**/*.css',
              'entities/**/*.css',
              'shared/**/*.css',
              './**/*.css',
              '../**/*.css',
              '**/*.scss',
              '**/*.sass',
              '**/*.less',
              '!app/styles/global.css',
            ],
            message:
              'Custom stylesheets are forbidden — style with Tailwind utility classes (compose them with cn() from shared/lib/styles). For a reusable class, add it to tailwind.config.ts instead of writing CSS. The only allowed stylesheet is app/styles/global.css; a third-party library\'s CSS must be imported directly from its package, not copied into src/.',
          },
        ],
      },
    ],
    'no-console': 'warn',
    'no-param-reassign': 'off',
    'global-require': 'off',
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'default-case': 'off',
    'consistent-return': 'off',
    curly: ['error', 'all'],
    'max-params': ['error', 3],
    'no-negated-condition': 'error',
    'no-unneeded-ternary': 'error',
    'require-await': 'error',
    'no-magic-numbers': [
      'warn',
      { ignoreArrayIndexes: true, ignore: [0, 1, -1, 60, 200, 401, 404, 500] },
    ],
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
    'func-style': ['error', 'expression'],
    'id-denylist': ['error', 'e', 'cb', 'item', 'i', 'err', 'el'],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      { blankLine: 'always', prev: ['case', 'default'], next: '*' },
    ],

    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-use-before-define': 'off',

    'react/react-in-jsx-scope': 'off',
    'react/function-component-definition': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],

    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/label-has-associated-control': 'off',

    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
    ],

    'prettier/prettier': 'warn',
  },
  overrides: [
    {
      // The one file allowed to read process.env directly.
      files: ['src/env.ts'],
      rules: {
        'no-restricted-properties': 'off',
      },
    },
  ],
};
