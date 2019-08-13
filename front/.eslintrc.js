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
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },

  globals: {}
}
