// src/handlers/triggerHandler.ts
import { FlowState, ExecutionContext, ExecutionResult } from '@/types/flow';
import { FLOW_EVENTS } from '../config/constants';
import { BaseStateHandler } from './baseHandler';

export class TriggerStateHandler extends BaseStateHandler {
  readonly type = 'trigger';

  async execute(
    state: FlowState,
    context: ExecutionContext
  ): Promise<ExecutionResult> {
    // Trigger states typically react to the initial event type
    const triggerEvent = context.variables.triggerEvent || FLOW_EVENTS.INCOMING_MESSAGE;
    
    return {
      event: triggerEvent,
      data: {
        triggeredAt: new Date(),
        contextId: context.flowId
      }
    };
  }
}
