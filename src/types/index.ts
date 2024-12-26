// src/types/index.ts
export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  label: string;
  description?: string;
  [key: string]: any;
}

export interface TriggerData extends NodeData {
  triggerType: 'incoming_call' | 'incoming_message' | 'rest_api';
  webhookUrl?: string;
}

export interface GatherInputData extends NodeData {
  inputType: 'dtmf' | 'speech' | 'both';
  promptMessage: string;
  timeout: number;
  attempts: number;
  speechLanguage?: string;
  dtmfLength?: number;
}

export interface PlayMessageData extends NodeData {
  messageType: 'tts' | 'audio';
  content: string;
  voice?: string;
  language?: string;
  loop?: number;
}

export interface SplitData extends NodeData {
  splitType: 'variable' | 'random' | 'time';
  conditions: Array<{
    value: string;
    output: string;
  }>;
  defaultOutput?: string;
}

export interface ConnectCallData extends NodeData {
  destination: string;
  destinationType: 'number' | 'sip' | 'client';
  timeout: number;
  callerId?: string;
  recordingEnabled?: boolean;
}

export interface RecordData extends NodeData {
  recordingType: 'audio' | 'transcription';
  maxDuration?: number;
  transcriptionEnabled?: boolean;
  beep?: boolean;
  trim?: boolean;
}

export interface MessageData extends NodeData {
  messageBody: string;
  mediaUrl?: string;
  senderId?: string;
}

export interface HttpRequestData extends NodeData {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
}

export interface IVRNode {
  id: string;
  type: string;
  position: Position;
  data: NodeData | TriggerData | GatherInputData | PlayMessageData | SplitData | 
        ConnectCallData | RecordData | MessageData | HttpRequestData;
  selected?: boolean;
  dragging?: boolean;
}

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
}


export interface Variable {
  key: string
  value: string
}

export interface IVRNode {
  id: string;
  type: 'trigger' | 'gather_input' | 'split' | 'connect_call' | 'set_variables';
  name: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label?: string;
    variables?: Variable[];
    [key: string]: any;
  };
}

export interface IVRNodeData {
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
