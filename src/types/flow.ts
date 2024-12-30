// src/types/flow.ts
export interface FlowTransition {
  event: string;
  next?: string;
}

export interface FlowStateProperties {
  offset?: {
    x: number;
    y: number;
  };
  say?: string;
  loop?: number;
  [key: string]: any;
}

export interface FlowState {
  name: string;
  type: string;
  properties: FlowStateProperties;
  transitions: FlowTransition[];
}

export interface FlowMetadata {
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  version: number;
  commitMessage?: string;
}

export interface FlowDefinition {
  flags?: {
    allow_concurrent_calls?: boolean;
    [key: string]: any;
  };
  description?: string;
  states: FlowState[];
  initial_state: string;
  metadata?: FlowMetadata;
}

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
