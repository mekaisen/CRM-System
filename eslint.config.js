import { eslint } from '@siberiacancode/eslint';

export default eslint(
  {
    typescript: true,
    react: true,
    jsx: true
  },
  {
    name: 'ProjectC/rewrite',
    rules: {
      'ts/ban-ts-comment': 'warn',
      'no-use-before-define': 'off',

      'ts/no-use-before-define': 'off',
      'ts/no-console': 'off',
      'ts/no-unnecessary-type-constraint': 'off',
      'prefer-const': 'off'
    }
  }
);
