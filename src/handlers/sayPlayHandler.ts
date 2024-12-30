// src/handlers/sayPlayHandler.ts
import { BaseStateHandler } from './baseHandler';
import { FLOW_EVENTS } from '../config/constants';
import { FlowState, ExecutionContext, ExecutionResult } from '@/types/flow';

export class SayPlayStateHandler extends BaseStateHandler {
  readonly type = 'say-play';

  async execute(
    state: FlowState,
    context: ExecutionContext
  ): Promise<ExecutionResult> {
    this.validateProperties(state, ['say']);

    const { say, loop = 1 } = state.properties;

    // In a real implementation, this would interface with a text-to-speech
    // or audio playback system
    const message = {
      text: say,
      loop,
      language: context.variables.language || 'en-US'
    };

    // Add to message history
    context.messageHistory.push({
      type: 'say-play',
      content: message,
      timestamp: new Date()
    });

    return {
      event: FLOW_EVENTS.AUDIO_COMPLETE,
      data: message
    };
  }
}