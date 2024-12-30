// src/api/flowController.ts
import { Request, Response } from 'express';
import { FlowExecutor } from '../services/flowExecutor';
import { FlowValidator } from '../utils/validation';
import { CreateFlowRequest, UpdateFlowRequest, ExecuteFlowRequest } from './types';
import { FlowNotFoundError, FlowValidationError } from '../types/errors';
import { FlowStore } from '@/stores/flow';

export class FlowController {
  constructor(
    private readonly flowStore: FlowStore, // 流程存储
    private readonly flowExecutor: FlowExecutor // 流程执行器
  ) {}

  // 创建流程
  async createFlow(req: Request, res: Response): Promise<void> {
    try {
      const { definition, commitMessage, status } = req.body as CreateFlowRequest;
      const flowId = req.params.flowId;

      // 验证流程定义
      FlowValidator.validateFlow(definition);

      // 创建流程
      const flow = await this.flowStore.createFlow(flowId, {
        ...definition,
        metadata: {
          status: status || 'draft', // 默认状态为草稿
          commitMessage
        }
      });

      res.status(201).json({
        success: true,
        data: flow
      });
    } catch (error) {
      this.handleError(res, error); // 处理错误
    }
  }

  // 更新流程
  async updateFlow(req: Request, res: Response): Promise<void> {
    try {
      const { definition, commitMessage, status } = req.body as UpdateFlowRequest;
      const flowId = req.params.flowId;

      // 验证流程定义
      FlowValidator.validateFlow(definition);

      // 更新流程
      const flow = await this.flowStore.updateFlow(flowId, {
        ...definition,
        metadata: {
          status: status || 'draft', // 默认状态为草稿
          commitMessage
        }
      });

      res.json({
        success: true,
        data: flow
      });
    } catch (error) {
      this.handleError(res, error); // 处理错误
    }
  }

  // 获取流程
  async getFlow(req: Request, res: Response): Promise<void> {
    try {
      const flowId = req.params.flowId;
      const flow = await this.flowStore.getFlow(flowId);

      res.json({
        success: true,
        data: flow
      });
    } catch (error) {
      this.handleError(res, error); // 处理错误
    }
  }

  // 删除流程
  async deleteFlow(req: Request, res: Response): Promise<void> {
    try {
      const flowId = req.params.flowId;
      await this.flowStore.deleteFlow(flowId);

      res.json({
        success: true
      });
    } catch (error) {
      this.handleError(res, error); // 处理错误
    }
  }

  // 列出所有流程
  async listFlows(req: Request, res: Response): Promise<void> {
    try {
      const flows = await this.flowStore.listFlows();

      res.json({
        success: true,
        data: flows
      });
    } catch (error) {
      this.handleError(res, error); // 处理错误
    }
  }

  // 执行流程
  async executeFlow(req: Request, res: Response): Promise<void> {
    try {
      const flowId = req.params.flowId;
      const { variables, triggerEvent } = req.body as ExecuteFlowRequest;

      const context = await this.flowExecutor.executeFlow(flowId, {
        ...variables,
        triggerEvent // 传入触发事件
      });

      res.json({
        success: true,
        data: {
          executionId: context.flowId,
          status: 'started' // 状态为已启动
        }
      });
    } catch (error) {
      this.handleError(res, error); // 处理错误
    }
  }

  // 获取执行状态
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
          status: this.flowExecutor.isExecuting(flowId) ? 'running' : 'completed', // 根据执行状态返回
          context
        }
      });
    } catch (error) {
      this.handleError(res, error); // 处理错误
    }
  }

  // 处理错误
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