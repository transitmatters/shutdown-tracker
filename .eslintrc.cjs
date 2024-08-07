module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'import', 'react-refresh', 'prettier'],
  rules: {
    'import/named': 'warn',
    'import/no-self-import': 'error',
    'import/order': 'error',
    'import/newline-after-import': 'error',
    'import/no-unresolved': 'off',
    'import/no-unused-modules': ['warn', { unusedExports: true }],
    'import/no-useless-path-segments': [
      'error',
      {
        noUselessIndex: true,
      },
    ],
    'import/max-dependencies': [
      'warn',
      {
        max: 20,
        ignoreTypeImports: false,
      },
    ],
    'no-console': 'error',
    'no-empty': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/prop-types': 'off',
    'react/jsx-no-target-blank': 'warn',
    'react/no-unescaped-entities': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/no-unused-prop-types': 'warn',
    'prettier/prettier': 'error',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};
