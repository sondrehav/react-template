module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Make sure this is always the last element in the array.
  ],
  plugins: [
    'simple-import-sort',
    'prettier',
    'react',
    '@typescript-eslint',
    'import',
    'jsx-a11y',
    'react-hooks',
  ],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],

    // React specific rules
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-curly-brace-presence': ['error', { props: 'always', children: 'never' }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',

    // Typescript specific rules
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-empty-interface': 'off',

    // Misc rules
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'arrow-parens': ['error', 'always'],
    'jsx-a11y/accessible-emoji': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    // This one is annoying. Ideally it should be on, but the way certain
    // components (Checkbox in particular) is set up with Typescript it should
    // only be neccessary to set it's id because the component injects the
    // htmlFor-prop. There might be a way to ignore such components:
    //  https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/label-has-associated-control.md
    'jsx-a11y/label-has-associated-control': 'off',
  },
};
