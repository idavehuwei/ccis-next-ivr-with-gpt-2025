// jest.config.mjs
export default {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jest-environment-jsdom', // Ensure the correct environment
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Path alias mapping
  },
  transform: {
    '^.+\\.vue$': 'vue-jest', // Process .vue files
    '^.+\\.ts$': 'ts-jest', // Process TypeScript files
    '^.+\\.js$': 'babel-jest', // If JS file support is needed
  },
  transformIgnorePatterns: [
    '/node_modules/',
  ],
  collectCoverage: true, // Enable code coverage
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!src/main.ts', // Ignore main entry file
    '!src/router/index.ts', // Ignore router configuration
    '!**/node_modules/**', // Ignore node_modules
  ],
  coverageDirectory: '<rootDir>/tests/coverage', // Coverage report output directory
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.(ts|js)', // Match unit test files
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.app.json', // Specify tsconfig
    },
  },
};