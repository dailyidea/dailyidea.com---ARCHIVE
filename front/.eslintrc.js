module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017
  },

  env: {
    browser: true,
    node: true,
    jest: true
  },

  extends: [
    '@nuxtjs',
    '@vue/prettier',
    'plugin:you-dont-need-lodash-underscore/compatible'
  ],

  // required to lint *.vue files
  plugins: ['prettier'],

  // add your custom rules here
  rules: {
    'no-console': 1,
    'no-debugger': 1,
    curly: ['error', 'all'],
    'padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: 'import', next: '*' },
      { blankLine: 'never', prev: 'import', next: 'import' }
    ],
  },

  globals: {}
}
