// src/tests/validation/flowValidator.test.ts
import { FlowValidator } from '../utils/validation';
import { sampleFlow } from './sampleFlows';
import { FlowValidationError } from '../types/errors';
import { describe, it } from 'node:test';

describe('FlowValidator', () => {
  describe('validateFlow', () => {
    it('should validate correct flow definition', () => {
      expect(() => {
        FlowValidator.validateFlow(sampleFlow);
      }).not.toThrow();
    });

    it('should throw error for missing initial state', () => {
      const invalidFlow = {
        ...sampleFlow,
        initial_state: 'non-existent'
      };

      expect(() => {
        FlowValidator.validateFlow(invalidFlow);
      }).toThrow(FlowValidationError);
    });

    it('should throw error for invalid transition target', () => {
      const invalidFlow = {
        ...sampleFlow,
        states: [
          {
            ...sampleFlow.states[0],
            transitions: [
              { event: 'test', next: 'non-existent' }
            ]
          }
        ]
      };

      expect(() => {
        FlowValidator.validateFlow(invalidFlow);
      }).toThrow(FlowValidationError);
    });
  });
});