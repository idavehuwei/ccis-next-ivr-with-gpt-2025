// src/services/flowExecutor.ts
import { EventEmitter } from 'eventemitter3';
import { getHandler } from '../handlers';
import { FLOW_CONSTANTS } from '../config/constants';
import { FlowStore } from '@/stores';
import { FlowNotFoundError, FlowExecutionError } from '@/types/errors';
import { ExecutionContext, FlowState, ExecutionResult, FlowDefinition } from '@/types/flow';

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
      // 获取流程定义
      const flow = await this.flowStore.getFlow(flowId);
      if (!flow) {
        throw new FlowNotFoundError(flowId);
      }

      // 检查流程是否已经在执行
      if (this.activeExecutions.has(flowId)) {
        throw new FlowExecutionError('Flow is already executing');
      }

      // 初始化执行上下文
      const context: ExecutionContext = {
        flowId,
        stateData: {},
        variables: initialVariables, // 使用传入的初始变量
        messageHistory: []
      };

      // 设置执行超时
      const timeout = setTimeout(() => {
        this.handleExecutionTimeout(flowId);
      }, FLOW_CONSTANTS.EXECUTION_TIMEOUT);

      this.executionTimeouts.set(flowId, timeout);
      this.activeExecutions.set(flowId, context);

      // 在 store 中标记流程为正在执行
      await this.flowStore.markFlowAsExecuting(flowId);

      // 触发执行开始事件
      this.emit('execution:started', flowId, context);

      // 从初始状态开始执行
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
      // 触发状态进入事件
      this.emit('state:entered', context.flowId, state);

      // 获取状态类型的处理器
      const handler = getHandler(state.type);
      if (!handler) {
        throw new FlowExecutionError(`No handler found for state type: ${state.type}`);
      }

      // 执行状态
      const result = await handler.execute(state, context);

      // 将状态执行结果存储在上下文中
      context.stateData[state.name] = result.data;

      // 触发状态完成事件
      this.emit('state:completed', context.flowId, state, result);

      // 根据结果查找下一个状态
      const transition = state.transitions.find(t => t.event === result.event);
      if (transition && transition.next) {
        // 执行下一个状态
        await this.executeState(flow, transition.next, context);
      } else {
        // 没有更多状态可执行
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

    // 清除超时
    const timeout = this.executionTimeouts.get(flowId);
    if (timeout) {
      clearTimeout(timeout);
      this.executionTimeouts.delete(flowId);
    }

    // 从活动执行中移除
    this.activeExecutions.delete(flowId);

    // 在 store 中标记流程为已完成
    await this.flowStore.markFlowAsCompleted(flowId);

    // 触发执行完成事件
    this.emit('execution:completed', flowId, context);
  }

  private handleExecutionTimeout(flowId: string): void {
    const error = new FlowExecutionError('Flow execution timed out');
    this.emit('execution:error', flowId, error);
    this.completeExecution(flowId).catch(console.error);
  }

  // 实用方法
  async pauseExecution(flowId: string): Promise<void> {
    // 暂停流程执行的实现
    throw new Error('Not implemented');
  }

  async resumeExecution(flowId: string): Promise<void> {
    // 恢复流程执行的实现
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