// src/handlers/gatherInputHandler.ts
import { BaseStateHandler } from './baseHandler';
import { FLOW_EVENTS } from '../config/constants';
import { FlowState, ExecutionContext, ExecutionResult } from '@/types/flow';

export class GatherInputHandler extends BaseStateHandler {
  readonly type = 'gather-input';

  async execute(
    state: FlowState,
    context: ExecutionContext
  ): Promise<ExecutionResult> {
    this.validateProperties(state, ['prompt', 'timeout']);

    const { prompt, timeout, inputType = 'text' } = state.properties;

    // In a real implementation, this would interface with an input
    // collection system
    const inputRequest = {
      prompt,
      timeout: Number(timeout),
      inputType,
      language: context.variables.language || 'en-US'
    };

    // Add to message history
    context.messageHistory.push({
      type: 'gather-input',
      content: inputRequest,
      timestamp: new Date()
    });

    // In a real implementation, this would wait for user input
    // For now, we'll simulate immediate input
    const simulatedInput = context.variables.simulatedInput || '';

    return {
      event: FLOW_EVENTS.INPUT_RECEIVED,
      data: {
        input: simulatedInput,
        inputType,
        timestamp: new Date()
      }
    };
  }
}