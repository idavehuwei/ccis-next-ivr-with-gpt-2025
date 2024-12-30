// src/store/flowStore.ts
 
import { FlowValidationError, FlowNotFoundError } from '@/types/errors';
import { FlowDefinition, FlowMetadata } from '@/types/flow';
import { FlowValidator } from '../utils/validation';
import { EventEmitter } from 'events';
  
  export interface FlowStoreEvents {
    'flow:created': (flowId: string, definition: FlowDefinition) => void;
    'flow:updated': (flowId: string, definition: FlowDefinition) => void;
    'flow:deleted': (flowId: string) => void;
    'flow:published': (flowId: string) => void;
  }
  
  export declare interface FlowStore {
    on<E extends keyof FlowStoreEvents>(event: E, listener: FlowStoreEvents[E]): this;
    emit<E extends keyof FlowStoreEvents>(
      event: E,
      ...args: Parameters<FlowStoreEvents[E]>
    ): boolean;
  }
  
  export class FlowStore extends EventEmitter {
    private flows: Map<string, FlowDefinition>;
    private executingFlows: Set<string>;
  
    constructor() {
      super();
      this.flows = new Map();
      this.executingFlows = new Set();
    }
  
    async createFlow(
      flowId: string, 
      definition: FlowDefinition
    ): Promise<FlowDefinition> {
      if (this.flows.has(flowId)) {
        throw new FlowValidationError(`Flow with ID ${flowId} already exists`);
      }
  
      // Validate flow definition
      FlowValidator.validateFlow(definition);
  
      // Add metadata
      const flowWithMetadata = {
        ...definition,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'draft',
          version: 1
        }
      };
  
      this.flows.set(flowId, flowWithMetadata);
      this.emit('flow:created', flowId, flowWithMetadata);
  
      return flowWithMetadata;
    }
  
    async updateFlow(
      flowId: string, 
      definition: FlowDefinition, 
      commitMessage?: string
    ): Promise<FlowDefinition> {
      const existingFlow = this.flows.get(flowId);
      if (!existingFlow) {
        throw new FlowNotFoundError(flowId);
      }
  
      // Validate flow definition
      FlowValidator.validateFlow(definition);
  
      // Update metadata
      const updatedFlow = {
        ...definition,
        metadata: {
          ...existingFlow.metadata,
          updatedAt: new Date(),
          version: (existingFlow.metadata?.version || 0) + 1,
          commitMessage
        }
      };
  
      this.flows.set(flowId, updatedFlow);
      this.emit('flow:updated', flowId, updatedFlow);
  
      return updatedFlow;
    }
  
    async getFlow(flowId: string): Promise<FlowDefinition> {
      const flow = this.flows.get(flowId);
      if (!flow) {
        throw new FlowNotFoundError(flowId);
      }
      return flow;
    }
  
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
  
    async publishFlow(flowId: string): Promise<FlowDefinition> {
      const flow = await this.getFlow(flowId);
      
      // Additional validation for publishing could be added here
      const publishedFlow = {
        ...flow,
        metadata: {
          ...flow.metadata,
          status: 'published' as const,
          updatedAt: new Date()
        }
      };
  
      this.flows.set(flowId, publishedFlow);
      this.emit('flow:published', flowId);
  
      return publishedFlow;
    }
  
    async listFlows(): Promise<Array<{ id: string; definition: FlowDefinition }>> {
      return Array.from(this.flows.entries()).map(([id, definition]) => ({
        id,
        definition
      }));
    }
  
    // Execution tracking methods
    async markFlowAsExecuting(flowId: string): Promise<void> {
      this.executingFlows.add(flowId);
    }
  
    async markFlowAsCompleted(flowId: string): Promise<void> {
      this.executingFlows.delete(flowId);
    }
  
    isFlowExecuting(flowId: string): boolean {
      return this.executingFlows.has(flowId);
    }
  
    // Version management methods
    async getFlowVersion(flowId: string, version: number): Promise<FlowDefinition> {
      // Note: This is a placeholder. In a real implementation, 
      // you would need to store and retrieve historical versions
      throw new Error('Version management not implemented');
    }
  
    // Utility methods
    private validateFlowMetadata(metadata: FlowMetadata): void {
      if (!metadata.status || !['draft', 'published'].includes(metadata.status)) {
        throw new FlowValidationError('Invalid flow status');
      }
  
      if (typeof metadata.version !== 'number' || metadata.version < 1) {
        throw new FlowValidationError('Invalid flow version');
      }
    }
  }
  