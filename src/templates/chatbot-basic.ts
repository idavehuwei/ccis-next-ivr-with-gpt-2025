// src/templates/chatbot-basic.ts
import type { MessageTemplate } from '@/types/message'

// 保持原有的消息模板
const messageTemplates: MessageTemplate[] = [
  {
    id: 'greeting',
    name: 'Greeting Message',
    content: 'Hello {{customer_name}}! How can I help you today?',
    variables: ['customer_name'],
    type: 'text',
    category: 'general',
    tags: ['greeting', 'welcome'],
    created: new Date(),
    updated: new Date()
  },
  {
    id: 'help',
    name: 'Help Message',
    content: `I can help you with:
- Product information
- Order status (Order: {{order_id}})
- Customer support
- Technical assistance`,
    variables: ['order_id'],
    type: 'text',
    category: 'support',
    tags: ['help', 'menu'],
    validation: {
      order_id: {
        required: true,
        pattern: /^ORD-\d{6}$/
      }
    }
  },
  {
    id: 'goodbye',
    name: 'Goodbye Message',
    content: 'Thank you for chatting with us, {{customer_name}}! Have a great day!',
    variables: ['customer_name'],
    type: 'text',
    category: 'general',
    tags: ['closing']
  },
  {
    id: 'fallback',
    name: 'Fallback Message',
    content: "I'm not sure I understand. Could you rephrase that? Or type 'help' for available options.",
    variables: [],
    type: 'text',
    category: 'error',
    tags: ['fallback', 'error']
  },
  {
    id: 'order-status',
    name: 'Order Status Message',
    content: 'Your order with ID {{order_id}} is currently {{order_status}}.',
    variables: ['order_id', 'order_status'],
    type: 'text',
    category: 'order',
    tags: ['order', 'status']
  },
  // 添加预约相关消息模板
  {
    id: 'appointment-reminder',
    name: 'Appointment Reminder',
    content: 'Hi {{customer_name}}, this is a reminder about your appointment on {{appointment_time}}. Reply YES to confirm or NO to reschedule.',
    variables: ['customer_name', 'appointment_time'],
    type: 'text',
    category: 'appointment',
    tags: ['appointment', 'reminder']
  },
  // IVR相关消息模板
  {
    id: 'ivr-welcome',
    name: 'IVR Welcome',
    content: 'Welcome to our service. For sales press 1, for support press 2, for billing press 3.',
    variables: [],
    type: 'text',
    category: 'ivr',
    tags: ['ivr', 'welcome']
  }
]

// 更新后的流程定义
const flow = {
  flags: {
    allow_concurrent_calls: true
  },
  description: "Chatbot Basic Flow",
  states: [
    {
      name: "Trigger",
      type: "trigger",
      properties: {},
      transitions: [
        { event: "incomingMessage", next: "greet" }
      ],
      position: { x: 250, y: 50 } // 调整位置
    },
    {
      name: "greet",
      type: "say-play",
      properties: {
        say: "Welcome to the chatbot!"
      },
      transitions: [
        { event: "audioComplete", next: "collect_name" }
      ],
      position: { x: 250, y: 150 } // 调整位置
    },
    {
      name: "collect_name",
      type: "gather-input",
      properties: {
        prompt: "What's your name?",
        timeout: 5000
      },
      transitions: [
        { event: "inputReceived", next: "farewell" }
      ],
      position: { x: 250, y: 250 } // 调整位置
    },
    {
      name: "farewell",
      type: "say-play",
      properties: {
        say: "Thanks for chatting!"
      },
      transitions: [
        { event: "audioComplete", next: "end" }
      ],
      position: { x: 250, y: 350 } // 调整位置
    },
    {
      name: "end",
      type: "end",
      properties: {},
      transitions: [], // 结束状态，没有后续状态
      position: { x: 250, y: 450 } // 调整位置
    }
  ],
  initial_state: "Trigger"
};

// 导出流程
export const chatbotFlow = flow;

// SMS模板 (使用原有的basicChatbotTemplate并扩展)
export const smsTemplate = {
  id: 'sms',
  name: 'SMS Chatbot',
  description: 'Have a conversation with your customers using both inbound and outbound SMS.',
  nodes: [
    {
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 250, y: 50 },
      data: {
        label: 'Message Trigger',
        triggerType: 'incoming_message'
      }
    },
    {
      id: 'msg-greeting',
      type: 'send_message',
      position: { x: 100, y: 400 },
      data: {
        label: 'Send Greeting',
        templateId: 'greeting',
        queueSettings: { enabled: true, delay: 0 }
      }
    },
    {
      id: 'msg-help',
      type: 'send_message',
      position: { x: 250, y: 400 },
      data: {
        label: 'Send Help',
        templateId: 'help',
        queueSettings: { enabled: true, delay: 1 }
      }
    },
    {
      id: 'msg-fallback',
      type: 'send_message',
      position: { x: 400, y: 400 },
      data: {
        label: 'Send Fallback',
        templateId: 'fallback',
        queueSettings: { enabled: true, delay: 1 }
      }
    }
  ],
  edges: [
    { id: 'e1-2', source: 'trigger-1', target: 'msg-greeting', type: 'smoothstep' },
    { id: 'e2-3', source: 'msg-greeting', target: 'msg-help', type: 'smoothstep' },
    { id: 'e3-4', source: 'msg-greeting', target: 'msg-fallback', type: 'smoothstep' }
  ],
  initData: {
    templates: messageTemplates,
    variables: [
      {
        name: 'customer_name',
        type: 'string',
        description: '客户姓名'
      },
      {
        name: 'message_count',
        type: 'number',
        description: '消息计数'
      }
    ]
  }
}

// 预约提醒模板
export const appointmentTemplate = {
  id: 'appointment',
  name: 'Appointment Reminders',
  description: 'Reduce no-shows by sending confirmation messages.',
  nodes: [
    {
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 250, y: 50 },
      data: {
        label: 'Appointment Trigger',
        triggerType: 'incoming_message'
      }
    },
    {
      id: 'set-appointment-vars',
      type: 'set_variables',
      position: { x: 250, y: 150 },
      data: {
        label: 'Set Appointment Variables',
        variables: [
          {
            name: 'appointment_time',
            value: '{{appointment.scheduled_time}}',
            type: 'string'
          },
          {
            name: 'customer_name',
            value: '{{contact.name}}',
            type: 'string'
          }
        ]
      }
    },
    {
      id: 'send-reminder',
      type: 'send_message',
      position: { x: 250, y: 250 },
      data: {
        label: 'Send Reminder',
        templateId: 'appointment-reminder',
        queueSettings: { enabled: true, delay: 0 }
      }
    },
    {
      id: 'wait-reply',
      type: 'wait_for_reply',
      position: { x: 250, y: 350 },
      data: {
        label: 'Wait for Confirmation',
        timeout: 3600,
        timeoutUnit: 'seconds'
      }
    },
    {
      id: 'split-response',
      type: 'split',
      position: { x: 250, y: 450 },
      data: {
        label: 'Check Response',
        conditions: [
          { variable: 'reply', operator: 'equals', value: 'YES' },
          { variable: 'reply', operator: 'equals', value: 'NO' }
        ]
      }
    }
  ],
  edges: [
    { id: 'e1-2', source: 'trigger-1', target: 'set-appointment-vars', type: 'smoothstep' },
    { id: 'e2-3', source: 'set-appointment-vars', target: 'send-reminder', type: 'smoothstep' },
    { id: 'e3-4', source: 'send-reminder', target: 'wait-reply', type: 'smoothstep' },
    { id: 'e4-5', source: 'wait-reply', target: 'split-response', type: 'smoothstep' }
  ],
  initData: {
    templates: messageTemplates,
    variables: [
      {
        name: 'appointment_time',
        type: 'string',
        description: '预约时间'
      },
      {
        name: 'customer_name',
        type: 'string',
        description: '客户姓名'
      },
      {
        name: 'confirmation_status',
        type: 'string',
        description: '确认状态'
      }
    ]
  }
}

// IVR模板
export const ivrTemplate = {
  id: 'ivr',
  name: 'IVR / Phone Tree',
  description: 'An Interactive Voice Response (IVR) system that precisely routes each caller.',
  nodes: [
    {
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 250, y: 50 },
      data: {
        label: 'Call Trigger',
        triggerType: 'incoming_call'
      }
    },
    {
      id: 'say-welcome',
      type: 'say_play',
      position: { x: 250, y: 150 },
      data: {
        label: 'Play Welcome',
        type: 'say',
        message: 'Welcome to our service.',
        voice: 'alice',
        language: 'en-US'
      }
    },
    {
      id: 'gather-choice',
      type: 'gather_input',
      position: { x: 250, y: 250 },
      data: {
        label: 'Gather Selection',
        prompt: 'For sales press 1, for support press 2, for billing press 3.',
        timeout: 5,
        finishOnKey: '#'
      }
    },
    {
      id: 'route-call',
      type: 'split',
      position: { x: 250, y: 350 },
      data: {
        label: 'Route Call',
        conditions: [
          { variable: 'digits', operator: 'equals', value: '1' },
          { variable: 'digits', operator: 'equals', value: '2' },
          { variable: 'digits', operator: 'equals', value: '3' }
        ]
      }
    },
    {
      id: 'connect-sales',
      type: 'connect_call',
      position: { x: 100, y: 450 },
      data: {
        label: 'Connect to Sales',
        number: '+1234567890',
        timeout: 30
      }
    },
    {
      id: 'connect-support',
      type: 'connect_call',
      position: { x: 250, y: 450 },
      data: {
        label: 'Connect to Support',
        number: '+1234567891',
        timeout: 30
      }
    },
    {
      id: 'connect-billing',
      type: 'connect_call',
      position: { x: 400, y: 450 },
      data: {
        label: 'Connect to Billing',
        number: '+1234567892',
        timeout: 30
      }
    }
  ],
  edges: [
    { id: 'e1-2', source: 'trigger-1', target: 'say-welcome', type: 'smoothstep' },
    { id: 'e2-3', source: 'say-welcome', target: 'gather-choice', type: 'smoothstep' },
    { id: 'e3-4', source: 'gather-choice', target: 'route-call', type: 'smoothstep' },
    { id: 'e4-5', source: 'route-call', target: 'connect-sales', sourceHandle: '1', type: 'smoothstep' },
    { id: 'e4-6', source: 'route-call', target: 'connect-support', sourceHandle: '2', type: 'smoothstep' },
    { id: 'e4-7', source: 'route-call', target: 'connect-billing', sourceHandle: '3', type: 'smoothstep' }
  ],
  initData: {
    variables: [
      {
        name: 'caller_id',
        type: 'string',
        description: '来电号码'
      },
      {
        name: 'selection',
        type: 'string',
        description: '用户选择'
      },
      {
        name: 'queue_time',
        type: 'number',
        description: '排队时间'
      }
    ]
  }
}

// 空模板(从头开始)
export const scratchTemplate = {
  id: 'scratch',
  name: 'Start from scratch',
  description: 'Start building from scratch.',
  nodes: [
    {
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 250, y: 50 },
      data: {
        label: 'Start Trigger',
        triggerType: 'incoming_message'
      }
    }
  ],
  edges: [],
  initData: {
    variables: []
  }
}

// 导出所有可用模板
export const availableTemplates = {
  scratch: scratchTemplate,
  appointment: appointmentTemplate,
  ivr: ivrTemplate,
  sms: smsTemplate
}

// 保持原有导出
export { messageTemplates as defaultMessageTemplates }