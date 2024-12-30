// src/handlers/index.ts
import { BaseStateHandler } from './baseHandler';
import { TriggerStateHandler } from './triggerHandler';
import { SayPlayStateHandler } from './sayPlayHandler';
import { GatherInputHandler } from './gatherInputHandler';
import { HttpRequestHandler } from './httpRequestHandler';
import { FLOW_STATE_TYPES } from '../config/constants';

const handlers: Record<string, new () => BaseStateHandler> = {
  [FLOW_STATE_TYPES.TRIGGER]: TriggerStateHandler,
  [FLOW_STATE_TYPES.SAY_PLAY]: SayPlayStateHandler,
  [FLOW_STATE_TYPES.GATHER_INPUT]: GatherInputHandler,
  [FLOW_STATE_TYPES.HTTP_REQUEST]: HttpRequestHandler
};

export function getHandler(type: string): BaseStateHandler | null {
  const HandlerClass = handlers[type];
  return HandlerClass ? new HandlerClass() : null;
}

export * from './baseHandler';
export * from './triggerHandler';
export * from './sayPlayHandler';
export * from './gatherInputHandler';
export * from './httpRequestHandler';
