module.exports = {
  transform: {
    '^.+\\.vue$': 'vue-jest', // jest-vue-preprocessor ?
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest'
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1'
  },

  snapshotSerializers: ['jest-serializer-vue'],

  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],

  testMatch: [
    '<rootDir>/(tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.spec.(js|jsx|ts|tsx))'
  ],

  testURL: 'http://localhost/',

  setupFiles: ['<rootDir>/jest.setup.js']
}
