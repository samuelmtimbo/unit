const js = require('@eslint/js')
const globals = require('globals')

const tsParser = require('@typescript-eslint/parser')
const tsPluginRaw = require('@typescript-eslint/eslint-plugin')
const tsPlugin = tsPluginRaw.default ?? tsPluginRaw

const importPluginRaw = require('eslint-plugin-import')
const importPlugin = importPluginRaw.default ?? importPluginRaw

const unusedImportsRaw = require('eslint-plugin-unused-imports')
const unusedImports = unusedImportsRaw.default ?? unusedImportsRaw

const prettierRaw = require('eslint-plugin-prettier')
const prettier = prettierRaw.default ?? prettierRaw

module.exports = [
  {
    ignores: [
      'src/script/**/*.ts',
      'src/**/_*.ts',
      'src/examples/**/*',
      '**/*.js',
      '**/*.d.ts',
      'node_modules/',
      'lib/',
      'build/',
      'dist/',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'unused-imports': unusedImports,
      prettier,
    },
    rules: {
      '@typescript-eslint/no-unnecessary-condition': 'off',
      'no-constant-binary-expression': 'off',
      'no-unused-vars': 'off',
      'no-console': 'error',
      'no-constant-condition': 'off',
      'prettier/prettier': 0,
      'no-async-promise-executor': 'off',
      'no-empty-pattern': 'off',
      'no-inner-declarations': 'off',
      'no-dupe-keys': 0,
      'no-empty': 'off',
      'import/no-duplicates': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      'prefer-const': 'off',
      'prefer-rest-params': 'off',
      'no-useless-catch': 'off',
      'no-prototype-builtins': 'off',
      'no-misleading-character-class': 'off',
      'no-self-assign': 'off',
      'no-unreachable': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'unused-imports/no-unused-imports': 'error',
    },
  },
  {
    files: ['src/client/platform/node/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['src/client/platform/web/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
      },
    },
  },
]
