// src/config/environments/development.ts
export default {
    server: {
      port: 3000,
      host: 'localhost'
    },
    flow: {
      executionTimeout: 30000,
      maxConcurrentExecutions: 5,
      storage: {
        type: 'memory'
      }
    },
    logging: {
      level: 'debug',
      format: 'detailed'
    }
  };