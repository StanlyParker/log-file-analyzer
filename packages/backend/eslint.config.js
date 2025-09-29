import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import js from '@eslint/js';
import { dirname } from 'path';
import globals from 'globals';
import { fileURLToPath } from 'url';
import typescriptParser from '@typescript-eslint/parser';

const { configs } = js;
const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**', 'reports/**'],
  },

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      globals: {
        ...globals.node,
        NodeJS: 'readonly',
      },
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },

    rules: {
      'no-console': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-console': 'warn',
    },
  },

  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
];
