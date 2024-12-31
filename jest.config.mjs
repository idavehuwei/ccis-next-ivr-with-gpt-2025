export default {
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.vue'],
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.[jt]s$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json'
      }
    ]
  },
  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.runtime.mjs',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.vue$': '<rootDir>/node_modules/@vue/vue3-jest'
  },
  testMatch: ['<rootDir>/tests/**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest-setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(@vue/runtime-dom|@vue/runtime-core|@vue/shared|vue-demi|pinia)/)'
  ]
}