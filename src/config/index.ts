// src/config/index.ts
import development from './environments/development';
import production from './environments/production';
import test from './environments/test';

const environments = {
  development,
  production,
  test
};

const env = process.env.NODE_ENV || 'development';
const config = environments[env as keyof typeof environments];

export default config;