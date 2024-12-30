// src/services/flowExecutor.ts
import { EventEmitter } from 'events';
import { 
  FlowDefinition, 
  FlowState, 
  ExecutionContext,
  ExecutionResult,
  FlowExecutionError,
  FlowNotFoundError 
} from '../types';
import { FlowStore } from '../store/flowStore';
import { getHandler } from '../handlers';
import { FLOW_CONSTANTS } from '../config/constants';

export interface FlowExecutorEvents {
  'execution:started': (flowId: string, context: ExecutionContext) => void;
  'execution:completed': (flowId: string, context: ExecutionContext) => void;
  'execution:error': (flowId: string, error: Error) => void;
  'state:entered': (flowId: string, state: FlowState) => void;
  'state:completed': (flowId: string, state: FlowState, result: ExecutionResult) => void;
  'state:error': (flowId: string, state: FlowState, error: Error) => void;
}

export declare interface FlowExecutor {
  on<E extends keyof FlowExecutorEvents>(event: E, listener: FlowExecutorEvents[E]): this;
  emit<E extends keyof FlowExecutorEvents>(
    event: E,
    ...args: Parameters<FlowExecutorEvents[E]>
  ): boolean;
}

export class FlowExecutor extends EventEmitter {
  private activeExecutions: Map<string, ExecutionContext>;
  private executionTimeouts: Map<string, NodeJS.Timeout>;

  constructor(private readonly flowStore: FlowStore) {
    super();
    this.activeExecutions = new Map();
    this.executionTimeouts = new Map();
  }

  async executeFlow(
    flowId: string,
    initialVariables: Record<string, any> = {}
  ): Promise<ExecutionContext> {
    try {
      // Get flow definition
      const flow = await this.flowStore.getFlow(flowId);
      if (!flow) {
        throw new FlowNotFoundError(flowId);
      }

      // Check if flow is already executing
      if (this.activeExecutions.has(flowId)) {
        throw new FlowExecutionError('Flow is already executing');
      }

      // Initialize execution context
      const context: ExecutionContext = {
        flowId,
        stateData: {},
        variables: initialVariables,
        messageHistory: []
      };

      // Set up execution timeout
      const timeout = setTimeout(() => {
        this.handleExecutionTimeout(flowId);
      }, FLOW_CONSTANTS.EXECUTION_TIMEOUT);

      this.executionTimeouts.set(flowId, timeout);
      this.activeExecutions.set(flowId, context);

      // Mark flow as executing in store
      await this.flowStore.markFlowAsExecuting(flowId);

      // Emit execution started event
      this.emit('execution:started', flowId, context);

      // Start execution from initial state
      await this.executeState(flow, flow.initial_state, context);

      return context;
    } catch (error) {
      this.emit('execution:error', flowId, error as Error);
      throw error;
    }
  }

  async executeState(
    flow: FlowDefinition,
    stateName: string,
    context: ExecutionContext
  ): Promise<void> {
    const state = flow.states.find(s => s.name === stateName);
    if (!state) {
      throw new FlowExecutionError(`State not found: ${stateName}`);
    }

    try {
      // Emit state entered event
      this.emit('state:entered', context.flowId, state);

      // Get handler for state type
      const handler = getHandler(state.type);
      if (!handler) {
        throw new FlowExecutionError(`No handler found for state type: ${state.type}`);
      }

      // Execute state
      const result = await handler.execute(state, context);

      // Store state execution result in context
      context.stateData[state.name] = result.data;

      // Emit state completed event
      this.emit('state:completed', context.flowId, state, result);

      // Find next state based on result
      const transition = state.transitions.find(t => t.event === result.event);
      if (transition && transition.next) {
        // Execute next state
        await this.executeState(flow, transition.next, context);
      } else {
        // No more states to execute
        await this.completeExecution(context.flowId);
      }
    } catch (error) {
      this.emit('state:error', context.flowId, state, error as Error);
      throw error;
    }
  }

  private async completeExecution(flowId: string): Promise<void> {
    const context = this.activeExecutions.get(flowId);
    if (!context) {
      return;
    }

    // Clear timeout
    const timeout = this.executionTimeouts.get(flowId);
    if (timeout) {
      clearTimeout(timeout);
      this.executionTimeouts.delete(flowId);
    }

    // Remove from active executions
    this.activeExecutions.delete(flowId);

    // Mark flow as completed in store
    await this.flowStore.markFlowAsCompleted(flowId);

    // Emit execution completed event
    this.emit('execution:completed', flowId, context);
  }

  private handleExecutionTimeout(flowId: string): void {
    const error = new FlowExecutionError('Flow execution timed out');
    this.emit('execution:error', flowId, error);
    this.completeExecution(flowId).catch(console.error);
  }

  // Utility methods
  async pauseExecution(flowId: string): Promise<void> {
    // Implementation for pausing flow execution
    throw new Error('Not implemented');
  }

  async resumeExecution(flowId: string): Promise<void> {
    // Implementation for resuming flow execution
    throw new Error('Not implemented');
  }

  async stopExecution(flowId: string): Promise<void> {
    await this.completeExecution(flowId);
  }

  getExecutionContext(flowId: string): ExecutionContext | undefined {
    return this.activeExecutions.get(flowId);
  }

  isExecuting(flowId: string): boolean {
    return this.activeExecutions.has(flowId);
  }
}

 