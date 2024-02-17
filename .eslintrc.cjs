module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
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
    'prettier/prettier': 'error',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};
