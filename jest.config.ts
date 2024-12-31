import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jest-environment-jsdom', // 确保使用正确的环境
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // 路径别名映射
  },
  transform: {
    '^.+\\.vue$': 'vue-jest', // 解析 .vue 文件
    '^.+\\.ts$': 'ts-jest', // 解析 TypeScript 文件
    '^.+\\.js$': 'babel-jest', // 如果需要支持 JS 文件
  },
  transformIgnorePatterns: [
    '/node_modules/',
  ],
  collectCoverage: true, // 开启代码覆盖率
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!src/main.ts', // 忽略主入口文件
    '!src/router/index.ts', // 忽略路由配置
    '!**/node_modules/**', // 忽略 node_modules
  ],
  coverageDirectory: '<rootDir>/tests/coverage', // 覆盖率报告输出目录
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.(ts|js)', // 匹配单元测试文件
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.app.json', // 指定 tsconfig
    },
  },
};

export default config;
