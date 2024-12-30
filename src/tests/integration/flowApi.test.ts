// src/tests/integration/flowApi.test.ts
import request from 'supertest';
import express from 'express';
import { createFlowRouter } from '../../api/routes';
import { sampleFlow } from '../fixtures/sampleFlows';
import { describe, beforeEach, it } from 'node:test';

describe('Flow API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api', createFlowRouter());
  });

  describe('POST /api/flows/:flowId', () => {
    it('should create new flow', async () => {
      const response = await request(app)
        .post('/api/flows/test-flow')
        .send({
          definition: sampleFlow,
          commitMessage: 'Initial creation'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('should validate flow definition', async () => {
      const response = await request(app)
        .post('/api/flows/test-flow')
        .send({
          definition: { invalid: 'flow' },
          commitMessage: 'Invalid flow'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/flows/:flowId/execute', () => {
    it('should execute flow', async () => {
      // Create flow first
      await request(app)
        .post('/api/flows/test-flow')
        .send({
          definition: sampleFlow,
          commitMessage: 'Initial creation'
        });

      // Execute flow
      const response = await request(app)
        .post('/api/flows/test-flow/execute')
        .send({
          variables: {
            input: 'test'
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.executionId).toBeDefined();
    });
  });
});

function expect(status: any) {
  throw new Error('Function not implemented.');
}

