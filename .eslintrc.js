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
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          'entities/*',
          'features/*',
          'widgets/*',
          'shared/constants/*',
          'shared/hooks/*',
          'shared/api/*',
          'shared/lib/*',
          'shared/ui/*',
          'shared/icons/*',
          'shared/types/*',
          'shared/providers/*',
          'shared/store/*',
        ],
        paths: [],
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
};
