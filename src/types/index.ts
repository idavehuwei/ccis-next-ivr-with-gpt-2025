// src/types/index.ts

// Base Types
export interface Position {
  x: number;
  y: number;
}

// Base Node Data
export interface NodeData {
  label: string;
  description?: string;
  [key: string]: any;
}

// Trigger Node
export interface TriggerData extends NodeData {
  triggerType: 'incoming_call' | 'incoming_message' | 'rest_api';
  webhookUrl?: string;
  webhookConfig?: {
    url: string;
    authType: string;
    username?: string;
    password?: string;
    token?: string;
  };
  scheduleConfig?: {
    type: 'interval' | 'cron' | 'fixed';
    interval?: number;
    unit?: string;
    cron?: string;
    time?: string;
  };
}

// Gather Input Node
export interface GatherInputData extends NodeData {
  inputType: 'dtmf' | 'speech' | 'both';
  promptMessage: string;
  timeout: number;
  attempts: number;
  speechLanguage?: string;
  dtmfLength?: number;
  validation?: {
    enabled: boolean;
    type: 'any' | 'number' | 'digits' | 'pattern';
    pattern?: string;
    errorMessage?: string;
  };
}

// Play Message Node
export interface PlayMessageData extends NodeData {
  messageType: 'tts' | 'audio';
  content: string;
  voice?: string;
  language?: string;
  loop?: number;
  settings?: {
    speed?: number;
    volume?: number;
    interruptible?: boolean;
  };
}

// Split Node
export interface SplitData extends NodeData {
  splitType: 'variable' | 'random' | 'time' | 'intent';
  conditions: Array<{
    value: string;
    output: string;
    operator?: string;
    confidence?: number;
  }>;
  defaultOutput?: string;
  timeRules?: Array<{
    startTime: string;
    endTime: string;
    output: string;
  }>;
}

// Connect Call Node
export interface ConnectCallData extends NodeData {
  destination: string;
  destinationType: 'number' | 'sip' | 'client';
  timeout: number;
  callerId?: string;
  recordingEnabled?: boolean;
  whisperEnabled?: boolean;
  screening?: {
    enabled: boolean;
    message?: string;
    acceptDigits?: string;
  };
}

// Record Node
export interface RecordData extends NodeData {
  recordingType: 'audio' | 'transcription';
  maxDuration?: number;
  transcriptionEnabled?: boolean;
  beep?: boolean;
  trim?: boolean;
  channels?: 'mono' | 'dual';
  quality?: 'high' | 'low';
}

// Message Node
export interface MessageData extends NodeData {
  messageBody: string;
  mediaUrl?: string;
  senderId?: string;
  templates?: Array<{
    name: string;
    content: string;
  }>;
}

// HTTP Request Node
export interface HttpRequestData extends NodeData {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
  authentication?: {
    type: 'none' | 'basic' | 'bearer';
    username?: string;
    password?: string;
    token?: string;
  };
}

// Send & Wait For Reply Node
export interface SendWaitReplyData extends NodeData {
  message: {
    body: string;
    from?: string;
    mediaUrl?: string;
    chatService?: string;
    chatChannel?: string;
    messageAttributes?: string;
  };
  wait: {
    timeout: number;
    timeoutMessage?: string;
  };
  variables?: {
    outbound: {
      body: string;
      from: string;
      sid: string;
      status: string;
      to: string;
    };
    inbound?: {
      body: string;
      from: string;
      mediaUrls: string[];
      messageSid: string;
      to: string;
    };
  };
}

// Virtual Agent Node
export interface VirtualAgentData extends NodeData {
  agentId: string;
  language?: string;
  nlpSettings?: {
    enableTranscription: boolean;
    enableSentimentAnalysis: boolean;
  };
  handoff?: {
    trigger: 'never' | 'customer_request' | 'sentiment' | 'no_resolution' | 'custom';
    condition?: string;
    target?: {
      type: 'queue' | 'agent' | 'skill';
      queue?: string;
      skills?: string[];
    };
  };
  timeouts?: {
    maxDuration: number;
    noInput: number;
  };
}

// Set Variables Node
export interface SetVariablesData extends NodeData {
  variables: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    value: any;
  }>;
}

// Node Types
export type NodeType =
  | 'trigger'
  | 'gather_input'
  | 'split'
  | 'connect_call'
  | 'set_variables'
  | 'say_play'
  | 'record'
  | 'http_request'
  | 'send_message'
  | 'send_wait_reply'
  | 'connect_virtual_agent';

// Transition Types
export type TransitionType =
  | 'success'
  | 'error'
  | 'timeout'
  | 'reply'
  | 'no_reply'
  | 'delivery_fails'
  | 'invalid'
  | 'completed'
  | 'handoff'
  | 'interrupted';

// IVR Node
export interface IVRNode {
  id: string;
  type: NodeType;
  position: Position;
  data: 
    | NodeData 
    | TriggerData 
    | GatherInputData 
    | PlayMessageData 
    | SplitData
    | ConnectCallData 
    | RecordData 
    | MessageData 
    | HttpRequestData
    | SendWaitReplyData
    | VirtualAgentData
    | SetVariablesData;
  selected?: boolean;
  dragging?: boolean;
}

// IVR Connection
export interface IVRConnection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceHandle?: string;
  targetHandle?: string;
  data?: {
    label?: string;
    condition?: string;
    priority?: number;
  };
}

// IVR Flow
export interface IVRFlow {
  id: string;
  name: string;
  description?: string;
  nodes: IVRNode[];
  edges: IVRConnection[];
  version: number;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  variables?: Variable[];
}

// Variable
export interface Variable {
  key: string;
  value: string;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description?: string;
}

// IVR Node Data
export interface IVRNodeData {
  label?: string;
  variables?: Variable[];
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url?: string;
  contentType?: 'application/x-www-form-urlencoded' | 'application/json';
  body?: string;
  authenticateWithTwilio?: boolean;
  parameters?: Array<{
    key: string;
    value: string;
  }>;
}

// Flow Execution Context
export interface ExecutionContext {
  flowId: string;
  variables: Record<string, any>;
  messageHistory: Array<{
    type: string;
    content: any;
    timestamp: Date;
  }>;
}

// Test Types
export interface TestCase {
  id: string;
  name: string;
  description?: string;
  inputs: Array<{
    type: string;
    value: any;
  }>;
  expectedOutputs: Array<{
    type: string;
    value: any;
  }>;
  variables?: Record<string, any>;
}

export interface TestResult {
  testCaseId: string;
  success: boolean;
  actualOutputs: Array<{
    type: string;
    value: any;
    timestamp: Date;
  }>;
  errors?: string[];
  duration: number;
  timestamp: Date;
}