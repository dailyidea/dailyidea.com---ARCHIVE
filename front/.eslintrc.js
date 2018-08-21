module.exports = {
  root: true,
  parser: 'vue-eslint-parser',

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module'
  },

  env: {
    browser: true,
    node: true,
    jest: true
  },

  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    '@vue/prettier',
    'plugin:you-dont-need-lodash-underscore/compatible'
  ],

  // required to lint *.vue files
  plugins: [
    'vue',
    'prettier'
  ],

  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/max-attributes-per-line': 'off',
    'prettier/prettier': 'error',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },

  globals: {}

}
