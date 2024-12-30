// src/config/environments/test.ts
export default {
    server: {
      port: 3001,
      host: 'localhost'
    },
    flow: {
      executionTimeout: 1000,
      maxConcurrentExecutions: 2,
      storage: {
        type: 'memory'
      }
    },
    logging: {
      level: 'error',
      format: 'simple'
    }
  };