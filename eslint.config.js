import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import noUselessComments from './eslint-rules/no-useless-comments.js';

export default tseslint.config(
  {
    ignores: ['dist/'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      local: {
        rules: {
          'no-useless-comments': noUselessComments,
        },
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'local/no-useless-comments': 'warn',
    },
  },
  prettierConfig
);
