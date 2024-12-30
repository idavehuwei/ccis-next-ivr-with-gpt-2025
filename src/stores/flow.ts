// src/stores/flow.ts

import { FlowValidationError, FlowNotFoundError } from '@/types/errors';
import { FlowDefinition, FlowMetadata } from '@/types/flow';
import { FlowValidator } from '../utils/validation';
import { EventEmitter } from 'eventemitter3';
import { defineStore } from 'pinia';

// Define the useFlowStore function
// 使用 Pinia 定义一个状态管理的 store，用于管理流程
export const useFlowStore = defineStore('flow', {
  state: () => ({
    // 存储所有流程的 Map，键为流程 ID，值为流程定义
    flows: new Map<string, FlowDefinition>(),
    // 存储正在执行的流程 ID 的集合
    executingFlows: new Set<string>(),
  }),
  actions: {
    // 创建一个新的流程
    async createFlow(flowId: string, definition: FlowDefinition): Promise<FlowDefinition> {
      // 检查流程 ID 是否已存在
      if (this.flows.has(flowId)) {
        throw new FlowValidationError(`Flow with ID ${flowId} already exists`);
      }

      // 验证流程定义的有效性
      FlowValidator.validateFlow(definition);

      // 将流程定义与元数据合并
      const flowWithMetadata = {
        ...definition,
        metadata: {
          createdAt: new Date(), // 创建时间
          updatedAt: new Date(), // 更新时间
          status: 'draft', // 流程状态
          version: 1, // 流程版本
        },
      };

      // 将流程添加到 flows Map 中
      this.flows.set(flowId, flowWithMetadata);
      this.$emit('flow:created', flowId, flowWithMetadata); // 触发流程创建事件

      return flowWithMetadata; // 返回创建的流程
    },
    // 更新现有流程
    async updateFlow(flowId: string, definition: FlowDefinition, commitMessage?: string): Promise<FlowDefinition> {
      const existingFlow = this.flows.get(flowId);
      // 检查流程是否存在
      if (!existingFlow) {
        throw new FlowNotFoundError(flowId);
      }

      // 验证流程定义的有效性
      FlowValidator.validateFlow(definition);

      // 创建更新后的流程定义
      const updatedFlow = {
        ...definition,
        metadata: {
          ...existingFlow.metadata,
          updatedAt: new Date(), // 更新时间
          version: (existingFlow.metadata?.version || 0) + 1, // 增加版本号
          commitMessage, // 提交信息
        },
      };

      // 更新流程
      this.flows.set(flowId, updatedFlow);
      this.$emit('flow:updated', flowId, updatedFlow); // 触发流程更新事件

      return updatedFlow; // 返回更新后的流程
    },
    // 获取指定 ID 的流程
    async getFlow(flowId: string): Promise<FlowDefinition> {
      const flow = this.flows.get(flowId);
      // 检查流程是否存在
      if (!flow) {
        throw new FlowNotFoundError(flowId);
      }
      return flow; // 返回流程
    },
    // 删除指定 ID 的流程
    async deleteFlow(flowId: string): Promise<void> {
      // 检查流程是否存在
      if (!this.flows.has(flowId)) {
        throw new FlowNotFoundError(flowId);
      }

      // 检查流程是否正在执行
      if (this.executingFlows.has(flowId)) {
        throw new FlowValidationError(
          `Cannot delete flow ${flowId} while it is executing`
        );
      }

      // 删除流程
      this.flows.delete(flowId);
      this.$emit('flow:deleted', flowId); // 触发流程删除事件
    },
    // 发布指定 ID 的流程
    async publishFlow(flowId: string): Promise<FlowDefinition> {
      const flow = await this.getFlow(flowId); // 获取流程

      // 创建发布后的流程定义
      const publishedFlow = {
        ...flow,
        metadata: {
          ...flow.metadata,
          status: 'published' as const, // 更新状态为已发布
          updatedAt: new Date(), // 更新时间
        },
      };

      // 更新流程
      this.flows.set(flowId, publishedFlow);
      this.$emit('flow:published', flowId); // 触发流程发布事件

      return publishedFlow; // 返回发布后的流程
    },
    // 列出所有流程
    async listFlows(): Promise<Array<{ id: string; definition: FlowDefinition }>> {
      return Array.from(this.flows.entries()).map(([id, definition]) => ({
        id,
        definition,
      }));
    },
    // 标记流程为正在执行
    async markFlowAsExecuting(flowId: string): Promise<void> {
      this.executingFlows.add(flowId);
    },
    // 标记流程为已完成
    async markFlowAsCompleted(flowId: string): Promise<void> {
      this.executingFlows.delete(flowId);
    },
    // 检查流程是否正在执行
    isFlowExecuting(flowId: string): boolean {
      return this.executingFlows.has(flowId);
    },
    // 获取指定版本的流程（未实现）
    async getFlowVersion(flowId: string, version: number): Promise<FlowDefinition> {
      throw new Error('Version management not implemented');
    },
    // 验证流程元数据的有效性
    validateFlowMetadata(metadata: FlowMetadata): void {
      if (!metadata.status || !['draft', 'published'].includes(metadata.status)) {
        throw new FlowValidationError('Invalid flow status');
      }

      if (typeof metadata.version !== 'number' || metadata.version < 1) {
        throw new FlowValidationError('Invalid flow version');
      }
    },
  },
});

// 定义 FlowStore 事件类型
export interface FlowStoreEvents {
  'flow:created': (flowId: string, definition: FlowDefinition) => void;
  'flow:updated': (flowId: string, definition: FlowDefinition) => void;
  'flow:deleted': (flowId: string) => void;
  'flow:published': (flowId: string) => void;
}

// 定义 FlowStore 接口
export declare interface FlowStore {
  on<E extends keyof FlowStoreEvents>(event: E, listener: FlowStoreEvents[E]): this;
  emit<E extends keyof FlowStoreEvents>(event: E, ...args: Parameters<FlowStoreEvents[E]>): boolean;
}

// FlowStore 类，继承自 EventEmitter
export class FlowStore extends EventEmitter {
  private flows: Map<string, FlowDefinition>; // 存储流程的 Map
  private executingFlows: Set<string>; // 存储正在执行的流程 ID 的集合

  constructor() {
    super();
    this.flows = new Map(); // 初始化流程 Map
    this.executingFlows = new Set(); // 初始化执行集合
  }

  // 创建流程
  async createFlow(flowId: string, definition: FlowDefinition): Promise<FlowDefinition> {
    if (this.flows.has(flowId)) {
      throw new FlowValidationError(`Flow with ID ${flowId} already exists`);
    }

    FlowValidator.validateFlow(definition);

    const flowWithMetadata = {
      ...definition,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
        version: 1,
      },
    };

    this.flows.set(flowId, flowWithMetadata);
    this.emit('flow:created', flowId, flowWithMetadata);

    return flowWithMetadata;
  }

  // 更新流程
  async updateFlow(flowId: string, definition: FlowDefinition, commitMessage?: string): Promise<FlowDefinition> {
    const existingFlow = this.flows.get(flowId);
    if (!existingFlow) {
      throw new FlowNotFoundError(flowId);
    }

    FlowValidator.validateFlow(definition);

    const updatedFlow = {
      ...definition,
      metadata: {
        ...existingFlow.metadata,
        updatedAt: new Date(),
        version: (existingFlow.metadata?.version || 0) + 1,
        commitMessage,
      },
    };

    this.flows.set(flowId, updatedFlow);
    this.emit('flow:updated', flowId, updatedFlow);

    return updatedFlow;
  }

  // 获取流程
  async getFlow(flowId: string): Promise<FlowDefinition> {
    const flow = this.flows.get(flowId);
    if (!flow) {
      throw new FlowNotFoundError(flowId);
    }
    return flow;
  }

  // 删除流程
  async deleteFlow(flowId: string): Promise<void> {
    if (!this.flows.has(flowId)) {
      throw new FlowNotFoundError(flowId);
    }

    if (this.executingFlows.has(flowId)) {
      throw new FlowValidationError(
        `Cannot delete flow ${flowId} while it is executing`
      );
    }

    this.flows.delete(flowId);
    this.emit('flow:deleted', flowId);
  }

  // 发布流程
  async publishFlow(flowId: string): Promise<FlowDefinition> {
    const flow = await this.getFlow(flowId);

    const publishedFlow = {
      ...flow,
      metadata: {
        ...flow.metadata,
        status: 'published' as const,
        updatedAt: new Date(),
      },
    };

    this.flows.set(flowId, publishedFlow);
    this.emit('flow:published', flowId);

    return publishedFlow;
  }

  // 列出所有流程
  async listFlows(): Promise<Array<{ id: string; definition: FlowDefinition }>> {
    return Array.from(this.flows.entries()).map(([id, definition]) => ({
      id,
      definition,
    }));
  }

  // 标记流程为正在执行
  async markFlowAsExecuting(flowId: string): Promise<void> {
    this.executingFlows.add(flowId);
  }

  // 标记流程为已完成
  async markFlowAsCompleted(flowId: string): Promise<void> {
    this.executingFlows.delete(flowId);
  }

  // 检查流程是否正在执行
  isFlowExecuting(flowId: string): boolean {
    return this.executingFlows.has(flowId);
  }

  // 获取指定版本的流程（未实现）
  async getFlowVersion(flowId: string, version: number): Promise<FlowDefinition> {
    throw new Error('Version management not implemented');
  }

  // 验证流程元数据的有效性
  private validateFlowMetadata(metadata: FlowMetadata): void {
    if (!metadata.status || !['draft', 'published'].includes(metadata.status)) {
      throw new FlowValidationError('Invalid flow status');
    }

    if (typeof metadata.version !== 'number' || metadata.version < 1) {
      throw new FlowValidationError('Invalid flow version');
    }
  }
}