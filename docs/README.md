// docs/README.md
# Flow System Documentation

## Overview
The Flow System is a flexible and extensible workflow engine that allows you to define, execute, and manage complex flows. It supports multiple state types, conditional transitions, and async execution.

## Quick Start

```typescript
import { FlowStore, FlowExecutor, createFlowRouter } from 'flow-system';

// Initialize the system
const flowStore = new FlowStore();
const flowExecutor = new FlowExecutor(flowStore);

// Create a simple flow
const flow = {
  flags: { allow_concurrent_calls: true },
  description: "Hello World Flow",
  states: [
    {
      name: "Trigger",
      type: "trigger",
      properties: {},
      transitions: [{ event: "incomingMessage", next: "say_hello" }]
    },
    {
      name: "say_hello",
      type: "say-play",
      properties: { say: "Hello World" },
      transitions: [{ event: "audioComplete" }]
    }
  ],
  initial_state: "Trigger"
};

// Create and execute the flow
await flowStore.createFlow('hello-world', flow);
await flowExecutor.executeFlow('hello-world');
```

## API Reference

### Flow Definition
- `flags`: Optional configuration flags
- `description`: Flow description
- `states`: Array of state definitions
- `initial_state`: Name of the starting state

### State Types
1. `trigger`: Entry point state
2. `say-play`: Text-to-speech or audio playback
3. `gather-input`: User input collection
4. `http-request`: External API calls

### REST API Endpoints
- POST /flows/:flowId - Create flow
- PUT /flows/:flowId - Update flow
- GET /flows/:flowId - Get flow
- DELETE /flows/:flowId - Delete flow
- POST /flows/:flowId/execute - Execute flow
- GET /flows/:flowId/status - Get execution status

## Configuration Guide

### Environment Variables
```env
FLOW_EXECUTION_TIMEOUT=30000
FLOW_MAX_CONCURRENT_EXECUTIONS=5
FLOW_STORAGE_TYPE=memory
```

### Custom State Handlers
```typescript
class CustomStateHandler extends BaseStateHandler {
  readonly type = 'custom';
  
  async execute(state: FlowState, context: ExecutionContext): Promise<ExecutionResult> {
    // Implementation
  }
}
```