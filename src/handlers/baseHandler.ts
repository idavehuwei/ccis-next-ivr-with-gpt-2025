// src/handlers/baseHandler.ts

import { ExecutionContext, ExecutionResult, FlowState } from "@/types/flow";

 
export abstract class BaseStateHandler {
  abstract readonly type: string;

  abstract execute(
    state: FlowState,
    context: ExecutionContext
  ): Promise<ExecutionResult>;

  protected validateProperties(
    state: FlowState,
    requiredProps: string[]
  ): void {
    for (const prop of requiredProps) {
      if (!(prop in state.properties)) {
        throw new Error(`Missing required property: ${prop}`);
      }
    }
  }
}

