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
  plugins: [
    'prettier'
  ],

  // add your custom rules here
  rules: {
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',

  },

  globals: {}

}
