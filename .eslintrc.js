module.exports = {
  root: true,
  extends: ['@react-native'],
  plugins: ['import'],

  // ── Per-file overrides ────────────────────────────────────────────────────
  overrides: [
    {
      // TypeScript files – enable typed linting
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      extends: [
        '@react-native',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        // Allow {} in generic type positions (React Navigation param lists start empty by design)
        '@typescript-eslint/no-empty-object-type': ['error', { allowObjectTypes: 'always' }],
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-ignore': true,
            'ts-expect-error': 'allow-with-description',
            'ts-nocheck': true,
            'ts-check': false,
          },
        ],
        '@typescript-eslint/consistent-type-imports': [
          'error',
          { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
        ],
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/no-require-imports': 'error',

        // ── Import order ────────────────────────────────────────────────
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
            pathGroups: [
              {
                pattern: 'react',
                group: 'external',
                position: 'before',
              },
              {
                pattern: 'react-native',
                group: 'external',
                position: 'before',
              },
              {
                pattern: '@/**',
                group: 'internal',
                position: 'after',
              },
            ],
            pathGroupsExcludedImportTypes: ['react', 'react-native'],
            'newlines-between': 'always',
            alphabetize: { order: 'asc', caseInsensitive: true },
          },
        ],
        'import/no-duplicates': 'error',
        'import/no-cycle': ['error', { maxDepth: 3 }],
        // react-native-config resolves at native build time, not via node resolution
        'import/no-unresolved': ['error', { ignore: ['react-native-config'] }],

        // ── React ────────────────────────────────────────────────────────
        'react/display-name': 'error',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',

        // ── General quality ──────────────────────────────────────────────
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        eqeqeq: ['error', 'always', { null: 'ignore' }],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
      },
      settings: {
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: './tsconfig.json',
          },
        },
      },
    },
  ],

  ignorePatterns: [
    'node_modules/',
    'android/',
    'ios/',
    '.bundle/',
    'coverage/',
    'babel.config.js',
    'metro.config.js',
    'jest.config.js',
    'commitlint.config.js',
    'tailwind.config.js',
    '.eslintrc.js',
    '.prettierrc.js',
  ],
};
