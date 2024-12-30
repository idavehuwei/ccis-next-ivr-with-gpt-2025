// src/tests/unit/flowExecutor.test.ts
import { ExecutionContext } from '@/types/flow';
import { describe, it } from 'node:test';
import { FlowExecutor } from '../../services/flowExecutor';
 
import { sampleFlow } from '../fixtures/sampleFlows';
import { FlowStore } from '@/stores/flowStore';

describe('FlowExecutor', () => {
  let flowStore: FlowStore;
  let flowExecutor: FlowExecutor;

  beforeEach(() => {
    flowStore = new FlowStore();
    flowExecutor = new FlowExecutor(flowStore);
  });

  describe('executeFlow', () => {
    it('should execute flow successfully', async () => {
      const flowId = 'test-flow';
      await flowStore.createFlow(flowId, sampleFlow);

      const context = await flowExecutor.executeFlow(flowId);

      expect(context).toBeDefined();
      expect(context.flowId).toBe(flowId);
      expect(context.messageHistory).toHaveLength(1);
    });

    it('should handle execution timeout', async () => {
      jest.useFakeTimers();
      const flowId = 'test-flow';
      await flowStore.createFlow(flowId, sampleFlow);

      const executionPromise = flowExecutor.executeFlow(flowId);
      jest.runAllTimers();

      await expect(executionPromise).rejects.toThrow('Flow execution timed out');
    });
  });
});

function beforeEach(arg0: () => void) {
    throw new Error('Function not implemented.');
}


function expect(context: ExecutionContext) {
    throw new Error('Function not implemented.');
}
