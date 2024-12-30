// src/api/routes.ts
import { Router } from 'express';
import { FlowController } from './flowController';
import { FlowStore } from '../stores/flow';
import { FlowExecutor } from '../services/flowExecutor';

export function createFlowRouter(): Router {
  const router = Router();
  const flowStore = new FlowStore();
  const flowExecutor = new FlowExecutor(flowStore);
  const flowController = new FlowController(flowStore, flowExecutor);

  // Flow CRUD endpoints
  router.post('/flows/:flowId', (req, res) => flowController.createFlow(req, res));
  router.put('/flows/:flowId', (req, res) => flowController.updateFlow(req, res));
  router.get('/flows/:flowId', (req, res) => flowController.getFlow(req, res));
  router.delete('/flows/:flowId', (req, res) => flowController.deleteFlow(req, res));
  router.get('/flows', (req, res) => flowController.listFlows(req, res));

  // Flow execution endpoints
  router.post('/flows/:flowId/execute', (req, res) => flowController.executeFlow(req, res));
  router.get('/flows/:flowId/status', (req, res) => flowController.getExecutionStatus(req, res));

  return router;
}
