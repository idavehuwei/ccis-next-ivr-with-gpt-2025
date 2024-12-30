// src/types/flow.ts
export interface Flow {
  id: string;
  name: string;
  description: string;
  definition: FlowDefinition;
  metadata: FlowMetadata;
  version: number;
  status: 'draft' | 'published';
}

export interface FlowDefinition {
  flags: {
    allow_concurrent_calls: boolean;
  };
  description: string;
  states: FlowState[];
  initial_state: string;
  variables?: FlowVariable[];
}

export interface FlowMetadata {
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  version: number;
  commitMessage?: string;
}

export interface FlowState {
  name: string;
  type: StateType;
  properties: StateProperties;
  transitions: StateTransition[];
}

export interface StateProperties {
  offset?: {
    x: number;
    y: number;
  };
  [key: string]: any;
}

export interface StateTransition {
  event: FlowEvent;
  next?: string;
  conditions?: TransitionCondition[];
}

export type StateType = 
  | 'trigger'
  | 'send_message'
  | 'send_and_wait'
  | 'set_variables'
  | 'split'
  | 'gather_input'
  | 'connect_call'
  | 'record'
  | 'play_message'
  | 'http_request'
  | 'run_function'
  | 'enqueue_call'
  | 'connect_virtual_agent'
  | 'nlp_intent';

export type FlowEvent =
  | 'incomingMessage'
  | 'incomingCall'
  | 'messageReceived'
  | 'messageSent'
  | 'inputReceived'
  | 'timeout'
  | 'error'
  | 'success'
  | 'audioComplete'
  | 'callConnected'
  | 'callDisconnected';




  export interface ExecutionContext {
    flowId: string;
    stateData: Record<string, any>;
    variables: Record<string, any>;
    messageHistory: any[];
  }
  export interface ExecutionResult {
    event: string;
    data?: any;
    error?: Error;
  }
  