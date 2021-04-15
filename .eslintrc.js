module.exports = {
  root: true,
  extends: ['plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2021,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      env: {
        node: true,
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:prettier/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './base.tsconfig.json',
      },
      plugins: ['@typescript-eslint'],
      settings: {
        'import/extensions': [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          'spec.ts',
          'spec.tsx',
        ],
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx', 'spec.ts', 'spec.tsx'],
        },
        'import/resolver': {
          node: {
            extensions: [
              '.js',
              '.jsx',
              '.ts',
              '.tsx',
              'd.ts',
              'spec.ts',
              'spec.tsx',
            ],
          },
          typescript: {},
        },
      },
      // Rules that apply only to typescript files should go here
      rules: {
        // This rule is enabled by eslint-config-airbnb and disabled by
        // eslint-plugin-prettier disables this rule:
        // https://github.com/prettier/eslint-plugin-prettier/issues/65
        // This is a rare issue and we feel like this rule improves the
        // consistency of the code so we keep it on.
        'arrow-body-style': 'warn',
        // Disabled because this almost never works properly.
        '@typescript-eslint/no-unsafe-assignment': 'off',
        // Disabled because this almost never works properly.
        '@typescript-eslint/no-unsafe-call': 'off',
        // Disabled because this almost never works properly.
        '@typescript-eslint/no-unsafe-member-access': 'off',
        // Disabled because this almost never works properly.
        '@typescript-eslint/no-unsafe-return': 'off',
      },
    },
  ],
  // Only rules that apply to both javascript and typescript files should go
  // here. Typescript rules should go in the overrides section.
  rules: {
    // This rule is enabled by eslint-config-airbnb and disabled by
    // eslint-plugin-prettier disables this rule:
    // https://github.com/prettier/eslint-plugin-prettier/issues/65
    // This is a rare issue and we feel like this rule improves the
    // consistency of the code so we keep it on.
    'arrow-body-style': 'warn',
    'prettier/prettier': 'warn',
    /*
     * "import/order" sorts the order of import declarations, ie:
     *
     * import b from "b";
     * import { z, a } from "x";
     */
    'import/order': [
      'warn',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        groups: [
          ['external', 'builtin', 'internal'],
          ['index', 'sibling', 'parent'],
        ],
        'newlines-between': 'always',
      },
    ],
    /*
     * Then, "sort-imports" complements "import/order" by sorting named imports,
     * like so:
     *
     * import b from "b";
     * import { a, z } from "x";
     */
    'sort-imports': [
      'warn',
      {
        ignoreCase: true,
        /*
         * This option turns off declaration sorting, as this is already handled
         * by "import/order".
         */
        ignoreDeclarationSort: true,
      },
    ],
  },
};
