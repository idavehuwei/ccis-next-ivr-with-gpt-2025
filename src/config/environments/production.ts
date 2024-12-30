// src/config/environments/production.ts
export default {
    server: {
      port: process.env.PORT || 3000,
      host: process.env.HOST || '0.0.0.0'
    },
    flow: {
      executionTimeout: parseInt(process.env.FLOW_EXECUTION_TIMEOUT || '30000'),
      maxConcurrentExecutions: parseInt(process.env.FLOW_MAX_CONCURRENT_EXECUTIONS || '5'),
      storage: {
        type: process.env.FLOW_STORAGE_TYPE || 'memory'
      }
    },
    logging: {
      level: 'info',
      format: 'json'
    }
  };