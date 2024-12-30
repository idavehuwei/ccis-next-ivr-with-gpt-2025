// src/api/flowController.ts
import { Request, Response } from 'express';
 
import { FlowExecutor } from '../services/flowExecutor';
import { FlowValidator } from '../utils/validation';
import { CreateFlowRequest, UpdateFlowRequest, ExecuteFlowRequest } from './types';
import { FlowNotFoundError, FlowValidationError } from '../types/errors';
import { FlowStore } from '@/stores/flow';

export class FlowController {
  constructor(
    private readonly flowStore: FlowStore,
    private readonly flowExecutor: FlowExecutor
  ) {}

  async createFlow(req: Request, res: Response): Promise<void> {
    try {
      const { definition, commitMessage, status } = req.body as CreateFlowRequest;
      const flowId = req.params.flowId;

      // Validate flow definition
      FlowValidator.validateFlow(definition);

      // Create flow
      const flow = await this.flowStore.createFlow(flowId, {
        ...definition,
        metadata: {
          status: status || 'draft',
          commitMessage
        }
      });

      res.status(201).json({
        success: true,
        data: flow
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async updateFlow(req: Request, res: Response): Promise<void> {
    try {
      const { definition, commitMessage, status } = req.body as UpdateFlowRequest;
      const flowId = req.params.flowId;

      // Validate flow definition
      FlowValidator.validateFlow(definition);

      // Update flow
      const flow = await this.flowStore.updateFlow(flowId, {
        ...definition,
        metadata: {
          status: status || 'draft',
          commitMessage
        }
      });

      res.json({
        success: true,
        data: flow
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getFlow(req: Request, res: Response): Promise<void> {
    try {
      const flowId = req.params.flowId;
      const flow = await this.flowStore.getFlow(flowId);

      res.json({
        success: true,
        data: flow
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async deleteFlow(req: Request, res: Response): Promise<void> {
    try {
      const flowId = req.params.flowId;
      await this.flowStore.deleteFlow(flowId);

      res.json({
        success: true
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async listFlows(req: Request, res: Response): Promise<void> {
    try {
      const flows = await this.flowStore.listFlows();

      res.json({
        success: true,
        data: flows
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async executeFlow(req: Request, res: Response): Promise<void> {
    try {
      const flowId = req.params.flowId;
      const { variables, triggerEvent } = req.body as ExecuteFlowRequest;

      const context = await this.flowExecutor.executeFlow(flowId, {
        ...variables,
        triggerEvent
      });

      res.json({
        success: true,
        data: {
          executionId: context.flowId,
          status: 'started'
        }
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getExecutionStatus(req: Request, res: Response): Promise<void> {
    try {
      const flowId = req.params.flowId;
      const context = this.flowExecutor.getExecutionContext(flowId);

      if (!context) {
        throw new FlowNotFoundError(flowId);
      }

      res.json({
        success: true,
        data: {
          executionId: context.flowId,
          status: this.flowExecutor.isExecuting(flowId) ? 'running' : 'completed',
          context
        }
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: any): void {
    if (error instanceof FlowNotFoundError) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    } else if (error instanceof FlowValidationError) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}