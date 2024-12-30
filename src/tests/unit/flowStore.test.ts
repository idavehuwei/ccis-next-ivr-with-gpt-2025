// src/tests/unit/flowStore.test.ts
 
import { sampleFlow } from '../fixtures/sampleFlows';
import { FlowNotFoundError, FlowValidationError } from '../../types/errors';
import { FlowStore } from '@/stores';
import { describe, beforeEach, it } from 'node:test';
import { FlowDefinition } from '@/types/flow';

describe('FlowStore', () => {
  let flowStore: FlowStore;

  beforeEach(() => {
    flowStore = new FlowStore();
  });

  describe('createFlow', () => {
    it('should create a new flow successfully', async () => {
      const flowId = 'test-flow';
      const flow = await flowStore.createFlow(flowId, sampleFlow);

      expect(flow).toBeDefined();
      expect(flow.metadata).toBeDefined();
      expect(flow.metadata.version).toBe(1);
      expect(flow.metadata.status).toBe('draft');
    });

    it('should throw error when creating duplicate flow', async () => {
      const flowId = 'test-flow';
      await flowStore.createFlow(flowId, sampleFlow);

      await expect(
        flowStore.createFlow(flowId, sampleFlow)
      ).rejects.toThrow(FlowValidationError);
    });
  });

  describe('updateFlow', () => {
    it('should update existing flow', async () => {
      const flowId = 'test-flow';
      await flowStore.createFlow(flowId, sampleFlow);

      const updatedFlow = await flowStore.updateFlow(flowId, {
        ...sampleFlow,
        description: 'Updated Flow'
      });

      expect(updatedFlow.description).toBe('Updated Flow');
      expect(updatedFlow.metadata.version).toBe(2);
    });

    it('should throw error when updating non-existent flow', async () => {
      await expect(
        flowStore.updateFlow('non-existent', sampleFlow)
      ).rejects.toThrow(FlowNotFoundError);
    });
  });
});
function expect(flow: FlowDefinition) {
    throw new Error('Function not implemented.');
}

