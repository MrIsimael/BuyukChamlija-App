module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single', 'double'],
    'no-unused-vars': ['warn', { varsIgnorePattern: '^React$' }], // Ignore React import
  },
};
