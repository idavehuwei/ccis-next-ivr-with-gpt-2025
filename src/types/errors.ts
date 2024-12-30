// src/types/errors.ts
export class FlowError extends Error {
    constructor(message: string, public code: string) {
      super(message);
      this.name = 'FlowError';
    }
  }
  
  export class FlowValidationError extends FlowError {
    constructor(message: string) {
      super(message, 'FLOW_VALIDATION_ERROR');
      this.name = 'FlowValidationError';
    }
  }
  
  export class FlowExecutionError extends FlowError {
    constructor(message: string) {
      super(message, 'FLOW_EXECUTION_ERROR');
      this.name = 'FlowExecutionError';
    }
  }
  
  export class FlowNotFoundError extends FlowError {
    constructor(flowId: string) {
      super(`Flow not found: ${flowId}`, 'FLOW_NOT_FOUND');
      this.name = 'FlowNotFoundError';
    }
  }