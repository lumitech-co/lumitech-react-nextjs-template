const path = require('path');

const RESTRICTED_SYNTAX = [
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
];

const NO_INLINE_QUERY_KEY = {
  selector: "Property[key.name='queryKey'] > ArrayExpression > Literal",
  message:
    'Query keys come from the QueryKeys enum (shared/constants/query-keys), never inline literals.',
};

const NO_LITERAL_TEXT_ATTRIBUTES = {
  selector:
    'JSXAttribute[name.name=/^(alt|placeholder|title|aria-label)$/] > Literal',
  message:
    'User-visible attribute text must come from next-intl (useTranslations / getTranslations).',
};

const SERVER_COMPONENT_ONLY = [
  {
    selector: "Program > ExpressionStatement[directive='use client']",
    message:
      'page.tsx / layout.tsx are Server Components — move interactive code into a feature or widget with its own "use client".',
  },
  {
    selector: 'CallExpression[callee.name=/^use[A-Z]/]',
    message:
      'No hooks in page.tsx / layout.tsx — they are Server Components. Use getTranslations etc. from next-intl/server.',
  },
];

const NO_GLOBAL_BARREL = [
  {
    selector: 'ExportAllDeclaration',
    message:
      'A layer-wide barrel ("export * from \'...\'" in src/<layer>/index.ts or src/shared/<segment>/index.ts) is forbidden. Re-export from the slice instead (e.g. features/members/index.ts), or import directly from the declaring file.',
  },
  {
    selector: 'ExportNamedDeclaration[source]',
    message:
      'A layer-wide barrel ("export { x } from \'...\'" in src/<layer>/index.ts or src/shared/<segment>/index.ts) is forbidden. Re-export from the slice instead (e.g. features/members/index.ts), or import directly from the declaring file.',
  },
];

const NO_CUSTOM_CSS = {
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
};

const NO_LOCALE_UNAWARE_NAVIGATION = [
  {
    name: 'next/link',
    message:
      'next/link drops the active locale — import { Link } from shared/lib/i18n/navigation instead.',
  },
  {
    name: 'next/navigation',
    importNames: ['useRouter', 'usePathname', 'redirect', 'permanentRedirect'],
    message:
      'These drop the active locale — import them from shared/lib/i18n/navigation instead (notFound, useSearchParams etc. are fine from next/navigation).',
  },
];

const NO_RASTER_IMAGES = {
  group: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
  message:
    'No raster images under src/ — use WebP in public/ rendered with next/image, or an SVG in shared/icons.',
};

const LAYER_SCOPED_IMPORTS = [
  {
    name: '@tanstack/react-query',
    importNames: [
      'useQuery',
      'useMutation',
      'useInfiniteQuery',
      'useSuspenseQuery',
      'useSuspenseInfiniteQuery',
    ],
    message:
      'Query/mutation hooks live only in entities/<entity>/hooks — use the entity hook instead.',
  },
  {
    name: 'axios',
    message:
      'axios is configured once in shared/lib/axios.ts — API calls belong in entities/<entity>/api.',
  },
  {
    name: 'shared/lib/axios',
    message:
      'The axios instance is used only in entities/<entity>/api — call the entity hook instead.',
  },
  {
    name: 'zustand',
    importNames: ['create'],
    message: 'zustand stores live only in shared/store.',
  },
];

const restrictedImports = (...allowed) => [
  'error',
  {
    paths: [...NO_LOCALE_UNAWARE_NAVIGATION, ...LAYER_SCOPED_IMPORTS].filter(
      ({ name }) => !allowed.includes(name),
    ),
    patterns: [NO_CUSTOM_CSS, NO_RASTER_IMAGES],
  },
];

const NEXT_ROUTE_FILES =
  '{page,layout,loading,error,global-error,not-found,forbidden,unauthorized,template,default,route,sitemap,robots,manifest,icon,apple-icon,opengraph-image,twitter-image}';

const SLICED_LAYERS = '{widgets,features,entities}';

const RELATIVE_SOURCE = '!{app,widgets,features,entities,shared}/**';

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:@tanstack/query/recommended',
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
    'boundaries/root-path': path.resolve(__dirname, 'src'),
    'boundaries/legacy-warnings': false,
    'boundaries/files': [
      { pattern: 'env.ts', category: 'env' },
      { pattern: 'middleware.ts', category: 'middleware' },
    ],
    'boundaries/elements': [
      {
        // Only Next.js route files: components and logic belong in features/widgets.
        type: 'app',
        mode: 'file',
        pattern: `app/**/${NEXT_ROUTE_FILES}.{ts,tsx}`,
      },
      { type: 'app', mode: 'file', pattern: 'app/styles/global.css' },
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
        // No `ui` segment and `.ts` only: entities are API-only (see rule 3 in CLAUDE.md).
        type: 'entities',
        mode: 'file',
        pattern: 'entities/*/(api|hooks|types)/**/*.ts',
        capture: ['slice', 'segment'],
      },
      {
        type: 'widgets',
        mode: 'file',
        pattern: 'widgets/*/index.{ts,tsx}',
        capture: ['slice'],
      },
      {
        type: 'features',
        mode: 'file',
        pattern: 'features/*/index.{ts,tsx}',
        capture: ['slice'],
      },
      {
        type: 'entities',
        mode: 'file',
        pattern: 'entities/*/index.{ts,tsx}',
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
    'boundaries/no-unknown-files': 'error',
    'boundaries/no-unknown-dependencies': 'error',
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
    'boundaries/dependencies': [
      'error',
      {
        default: 'disallow',
        checkInternals: true,
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
                {
                  element: {
                    type: 'entities',
                    captured: { segment: '{hooks,types}' },
                  },
                },
                { element: { type: 'shared' } },
                { file: { categories: 'env' } },
              ],
            },
            message:
              '"features" may only import their own slice, entity "hooks"/"types", "shared" and "env" — not entities/*/api, other features, widgets or app.',
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
                {
                  element: {
                    type: 'entities',
                    captured: { segment: '{hooks,types}' },
                  },
                },
                { element: { type: 'shared' } },
                { file: { categories: 'env' } },
              ],
            },
            message:
              '"widgets" may only import their own slice, "features", entity "hooks"/"types", "shared" and "env" — not entities/*/api, other widgets or app.',
          },
          {
            from: { file: { categories: 'middleware' } },
            allow: { to: { element: { type: 'shared' } } },
            message: 'src/middleware.ts may only import "shared".',
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
          {
            from: { element: { type: SLICED_LAYERS } },
            disallow: {
              to: {
                element: {
                  type: '{{ from.element.types.[0] }}',
                  captured: { slice: '{{ from.element.captured.slice }}' },
                },
              },
              dependency: { source: `${SLICED_LAYERS}/**` },
            },
            message: 'Import files of your own slice with a relative path.',
          },
          {
            disallow: {
              to: { element: { type: '!{{ from.element.types.[0] }}' } },
              dependency: { source: RELATIVE_SOURCE },
            },
            message:
              'Relative imports never cross layers — import other layers by absolute path from src.',
          },
          {
            from: { element: { type: SLICED_LAYERS } },
            disallow: {
              to: {
                element: {
                  captured: { slice: '!{{ from.element.captured.slice }}' },
                },
              },
              dependency: { source: RELATIVE_SOURCE },
            },
            message:
              'Relative imports are for your own slice only — import other slices by absolute path from src.',
          },
        ],
      },
    ],
    'no-restricted-syntax': ['error', ...RESTRICTED_SYNTAX, NO_INLINE_QUERY_KEY],
    'no-restricted-properties': [
      'error',
      {
        object: 'process',
        property: 'env',
        message:
          'Do not read process.env directly — add the variable to src/env.ts and import `env` from there instead.',
      },
    ],
    'no-restricted-imports': restrictedImports(),
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
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: { attributes: false } },
    ],
    '@typescript-eslint/consistent-type-imports': 'error',

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
    'react/forbid-dom-props': ['error', { forbid: ['style'] }],

    '@next/next/no-img-element': 'error',

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
      files: ['src/shared/lib/i18n/navigation.ts'],
      rules: {
        'no-restricted-imports': restrictedImports('next/link', 'next/navigation'),
      },
    },
    {
      files: ['src/entities/*/hooks/**'],
      rules: {
        'no-restricted-imports': restrictedImports('@tanstack/react-query'),
      },
    },
    {
      files: ['src/entities/*/api/**'],
      rules: {
        'no-restricted-imports': restrictedImports('shared/lib/axios'),
      },
    },
    {
      files: ['src/shared/lib/axios.ts'],
      rules: {
        'no-restricted-imports': restrictedImports('axios'),
      },
    },
    {
      files: ['src/shared/store/**'],
      rules: {
        'no-restricted-imports': restrictedImports('zustand'),
      },
    },
    {
      files: [
        'src/app/**/*.tsx',
        'src/widgets/**/*.tsx',
        'src/features/**/*.tsx',
      ],
      rules: {
        'react/jsx-no-literals': ['error', { noStrings: true, ignoreProps: true }],
        'no-restricted-syntax': [
          'error',
          ...RESTRICTED_SYNTAX,
          NO_INLINE_QUERY_KEY,
          NO_LITERAL_TEXT_ATTRIBUTES,
        ],
      },
    },
    {
      files: ['src/app/**/{page,layout}.tsx'],
      rules: {
        'no-restricted-syntax': [
          'error',
          ...RESTRICTED_SYNTAX,
          NO_INLINE_QUERY_KEY,
          NO_LITERAL_TEXT_ATTRIBUTES,
          ...SERVER_COMPONENT_ONLY,
        ],
      },
    },
    {
      files: ['src/env.ts'],
      rules: {
        'no-restricted-properties': 'off',
      },
    },
    {
      files: [
        'src/app/index.{ts,tsx}',
        'src/widgets/index.{ts,tsx}',
        'src/features/index.{ts,tsx}',
        'src/entities/index.{ts,tsx}',
        'src/shared/index.{ts,tsx}',
        'src/shared/*/index.{ts,tsx}',
      ],
      rules: {
        'no-restricted-syntax': ['error', ...RESTRICTED_SYNTAX, ...NO_GLOBAL_BARREL],
      },
    },
  ],
};
