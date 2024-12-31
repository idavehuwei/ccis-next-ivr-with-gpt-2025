根据Twilio文档和现有项目代码，我来完善这个文档：
Studio Nodes Documentation
Flow Control
Trigger
流程的起始触发节点。

节点类型: trigger
组件: TriggerNode.vue
主要功能:

接收传入事件并启动流程
设置初始流程变量
验证传入请求


触发类型:
typescriptCopytype TriggerType = 'incoming_message' | 'incoming_call' | 'rest_api'

配置选项:
typescriptCopyinterface TriggerConfig {
  triggerType: TriggerType;
  channel?: string;
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

输出状态:

success: 触发成功
error: 触发失败



Split Based On...
根据条件分流的控制节点。

节点类型: split
组件: SplitNode.vue
主要功能:

条件判断分流
多分支路由
默认路径处理


分支类型:
typescriptCopyinterface SplitConfig {
  splitType: 'variable' | 'random' | 'time';
  variable?: string;
  conditions?: Array<{
    operator: string;
    value: string;
    handleId: string;
  }>;
  branches?: Array<{
    percentage: number;
    handleId: string;
  }>;
  timeRules?: Array<{
    startTime: string;
    endTime: string;
    handleId: string;
  }>;
}

输出状态: 动态根据条件生成

Set Variables
变量设置和管理节点。

节点类型: set_variables
组件: SetVariablesNode.vue
主要功能:

设置流程变量
变量类型转换
变量值计算


配置选项:
typescriptCopyinterface Variable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  value: any;
}


Voice
Say/Play
语音播报和音频播放节点。

节点类型: say_play
组件: SayPlayNode.vue
主要功能:

文本转语音播放
音频文件播放
语音参数控制


配置选项:
typescriptCopyinterface SayPlayConfig {
  type: 'say' | 'play';
  message?: string;
  voice?: string;
  language?: string;
  audioUrl?: string;
  loop?: number;
  volume?: number;
  ssmlEnabled?: boolean;
}

输出状态:

audio_complete: 播放完成
error: 播放失败



Gather Input On Call
语音输入采集节点。

节点类型: gather_input
组件: GatherInputNode.vue
主要功能:

DTMF按键采集
语音输入识别
输入验证处理


配置选项:
typescriptCopyinterface GatherInputConfig {
  inputType: 'dtmf' | 'speech' | 'both';
  prompt: string;
  timeout: number;
  finishOnKey: string;
  numDigits?: number;
  language?: string;
  enhanced?: boolean;
}

输出状态:

valid: 有效输入
invalid: 无效输入
timeout: 超时
error: 错误



Connect Call To
呼叫连接和转接节点。

节点类型: connect_call
组件: ConnectCallNode.vue
主要功能:

呼叫连接
呼叫转接
呼叫控制


配置选项:
typescriptCopyinterface ConnectCallConfig {
  destination: string;
  phoneNumber?: string;
  timeout?: number;
  maxRetries?: number;
  callerId?: string;
  record?: boolean;
}

输出状态:

connected: 连接成功
busy: 忙线
failed: 失败
no_answer: 无应答



Enqueue Call
呼叫排队管理节点。

节点类型: enqueue_call
组件: EnqueueCallNode.vue
主要功能:

呼叫排队
优先级管理
等待处理


配置选项:
typescriptCopyinterface EnqueueConfig {
  queueName: string;
  priority?: number;
  waitMusicType?: 'default' | 'custom' | 'twiml';
  waitMusicUrl?: string;
  maxWaitTime?: number;
  timeUnit?: 'seconds' | 'minutes';
  announcePosition?: boolean;
  announceWaitTime?: boolean;
  allowCallback?: boolean;
}

输出状态:

enqueued: 已入队
connect: 已连接
timeout: 超时
callback: 回拨
error: 错误



Messaging
Send Message
消息发送节点。

节点类型: send_message
组件: SendMessageNode.vue
主要功能:

消息发送
模板处理
变量替换


配置选项:
typescriptCopyinterface SendMessageConfig {
  templateId?: string;
  content: string;
  mediaUrls?: string[];
  queueSettings?: {
    enabled: boolean;
    delay: number;
  };
}

输出状态:

success: 发送成功
failed: 发送失败



Send & Wait For Reply
消息发送并等待回复节点。

节点类型: send_and_wait
组件: SendAndWaitNode.vue
主要功能:

消息发送
回复等待
超时处理
回复验证


配置选项:
typescriptCopyinterface SendWaitConfig {
  message: string;
  timeout: number;
  retries?: number;
  templates?: Array<{
    name: string;
    content: string;
  }>;
  validation?: {
    enabled: boolean;
    type: 'any' | 'text' | 'regex' | 'number';
    pattern?: string;
    invalidMessage?: string;
  };
}

输出状态:

reply: 收到回复
timeout: 超时
invalid: 无效回复
error: 错误



Integration
Run Function
函数执行节点。

节点类型: run_function
组件: RunFunctionNode.vue
主要功能:

函数调用
参数传递
结果处理


配置选项:
typescriptCopyinterface RunFunctionConfig {
  service?: string;
  environment?: 'dev' | 'stage' | 'prod';
  function?: string;
  parameters?: Array<{
    key: string;
    value: string;
  }>;
}

输出状态:

success: 执行成功
failed: 执行失败



Make HTTP Request
HTTP请求节点。

节点类型: http_request
组件: HttpRequestNode.vue
主要功能:

发送HTTP请求
响应处理
错误处理


配置选项:
typescriptCopyinterface HttpRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  body?: string;
  contentType?: string;
  authenticateWithTwilio?: boolean;
  parameters?: Array<{
    key: string;
    value: string;
  }>;
}

输出状态:

success: 请求成功
failed: 请求失败



每个节点都继承自 BaseNode.vue，确保了统一的接口和行为：

输入/输出连接点（Handles）
配置面板
状态管理
事件处理
错误处理机制

这个文档反映了当前项目的实际实现，并与Twilio Studio的功能保持一致。