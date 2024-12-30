// src/types/flow.ts
export interface Flow {
  id: string; // flow ID
  name: string; // flow 名称
  description: string; // flow 描述
  definition: FlowDefinition; // flow 定义
  metadata: FlowMetadata; // flow 元数据
  version: number; // flow 版本
  status: 'draft' | 'published'; // flow 状态
}

export interface FlowDefinition {
  flags: {
    allow_concurrent_calls: boolean; // 允许并发调用的标志
  };
  description: string; // flow 描述
  states: FlowState[]; // 状态数组
  initial_state: string; // 初始状态
  variables?: FlowVariable[]; // 可选的变量
}

export interface FlowMetadata {
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
  status: 'draft' | 'published'; // 状态
  version: number; // 版本号
  commitMessage?: string; // 可选的提交信息
}

export interface FlowState {
  name: string; // 状态名称
  type: StateType; // 状态类型
  properties: StateProperties; // 状态属性
  transitions: StateTransition[]; // 状态转换
}

export interface StateProperties {
  offset?: {
    x: number; // X 坐标偏移
    y: number; // Y 坐标偏移
  };
  [key: string]: any; // 其他属性
}

export interface StateTransition {
  event: FlowEvent; // 事件
  next?: string; // 下一个状态
  conditions?: TransitionCondition[]; // 可选的条件
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

export interface FlowVariable {
  name: string; // 变量名称
  value: any; // 变量值
}

export interface TransitionCondition {
  type: string; // 条件类型
  value: any; // 条件值
}

export interface ExecutionContext {
  flowId: string; // flow ID
  stateData: Record<string, any>; // 状态数据
  variables: Record<string, any>; // 变量
  messageHistory: any[]; // 消息历史
}

export interface ExecutionResult {
  event: string; // 事件
  data?: any; // 可选的数据
  error?: Error; // 可选的错误
}