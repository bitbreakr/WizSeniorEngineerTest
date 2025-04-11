module.exports = {
  root: true,
  env: {
    mocha: true,
    node: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:vue/recommended',
  ],
  rules: {
    'linebreak-style': 0,
    'no-underscore-dangle': 0,
    'object-curly-newline': 0,
    'no-param-reassign': 0,
    'no-restricted-syntax': 0,
    'max-len': ['error', { code: 120, ignoreComments: true }],
    'operator-linebreak': ['error', 'after'],
    'no-console': 0,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
};
