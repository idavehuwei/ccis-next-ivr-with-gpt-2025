// src/templates/chatbot-basic.ts
import type { MessageTemplate } from '@/types/message'

// 预定义消息模板
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
  }
]

export const basicChatbotTemplate = {
  name: 'Basic Chatbot',
  description: 'Simple chatbot with NLP intent classification',
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
      id: 'set-vars',
      type: 'set_variables',
      position: { x: 250, y: 150 },
      data: {
        label: 'Set Initial Variables',
        variables: [
          {
            name: 'customer_name',
            value: '{{contact.name}}',
            type: 'string'
          },
          {
            name: 'order_id',
            value: '{{contact.last_order_id}}',
            type: 'string'
          }
        ]
      }
    },
    {
      id: 'nlp-1',
      type: 'nlp_intent',
      position: { x: 250, y: 250 },
      data: {
        label: 'Classify Intent',
        service: 'dialogflow',
        intents: [
          { name: 'greeting', confidence: '0.7' },
          { name: 'help', confidence: '0.7' },
          { name: 'goodbye', confidence: '0.7' },
          { name: 'order-status', confidence: '0.7' }
        ]
      }
    },
    {
      id: 'msg-greeting',
      type: 'send_message',
      position: { x: 100, y: 400 },
      data: {
        label: 'Send Greeting',
        templateId: 'greeting',
        queueSettings: {
          enabled: true,
          delay: 0
        }
      }
    },
    {
      id: 'msg-help',
      type: 'send_message',
      position: { x: 250, y: 400 },
      data: {
        label: 'Send Help',
        templateId: 'help',
        queueSettings: {
          enabled: true,
          delay: 1
        }
      }
    },
    {
      id: 'msg-order-status',
      type: 'send_message',
      position: { x: 400, y: 400 },
      data: {
        label: 'Send Order Status',
        templateId: 'order-status',
        queueSettings: {
          enabled: true,
          delay: 1
        }
      }
    },
    {
      id: 'msg-goodbye',
      type: 'send_message',
      position: { x: 550, y: 400 },
      data: {
        label: 'Send Goodbye',
        templateId: 'goodbye',
        queueSettings: {
          enabled: true,
          delay: 0
        }
      }
    },
    {
      id: 'msg-fallback',
      type: 'send_message',
      position: { x: 700, y: 400 },
      data: {
        label: 'Send Fallback',
        templateId: 'fallback',
        queueSettings: {
          enabled: true,
          delay: 1
        }
      }
    }
  ],
  edges: [
    {
      id: 'e1-2',
      source: 'trigger-1',
      target: 'set-vars',
      type: 'smoothstep'
    },
    {
      id: 'e2-3',
      source: 'set-vars',
      target: 'nlp-1',
      type: 'smoothstep'
    },
    {
      id: 'e3-4',
      source: 'nlp-1',
      target: 'msg-greeting',
      sourceHandle: 'greeting',
      type: 'smoothstep'
    },
    {
      id: 'e3-5',
      source: 'nlp-1',
      target: 'msg-help',
      sourceHandle: 'help',
      type: 'smoothstep'
    },
    {
      id: 'e3-6',
      source: 'nlp-1',
      target: 'msg-order-status',
      sourceHandle: 'order-status',
      type: 'smoothstep'
    },
    {
      id: 'e3-7',
      source: 'nlp-1',
      target: 'msg-goodbye',
      sourceHandle: 'goodbye',
      type: 'smoothstep'
    },
    {
      id: 'e3-8',
      source: 'nlp-1',
      target: 'msg-fallback',
      sourceHandle: 'fallback',
      type: 'smoothstep'
    }
  ],
  // 添加模板初始化数据
  initData: {
    templates: messageTemplates,
    variables: [
      {
        name: 'customer_name',
        type: 'string',
        value: '',
        description: '客户名称'
      },
      {
        name: 'order_id',
        type: 'string',
        value: '',
        description: '订单编号'
      },
      {
        name: 'order_status',
        type: 'string',
        value: '',
        description: '订单状态'
      }
    ]
  }
}

// 客服机器人模板
export const customerSupportTemplate = {
  name: 'Customer Support Bot',
  description: 'Advanced support bot with user input collection',
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
      id: 'welcome-msg',
      type: 'send_message',
      position: { x: 250, y: 150 },
      data: {
        label: 'Welcome Message',
        message: 'Welcome to customer support! How can I assist you today?'
      }
    },
    {
      id: 'intent-classifier',
      type: 'nlp_intent',
      position: { x: 250, y: 250 },
      data: {
        label: 'Classify Support Type',
        service: 'dialogflow',
        intents: [
          { name: 'technical_support', confidence: '0.7' },
          { name: 'billing_support', confidence: '0.7' },
          { name: 'general_inquiry', confidence: '0.7' }
        ]
      }
    }
  ],
  edges: [
    {
      id: 'e1-2',
      source: 'trigger-1',
      target: 'welcome-msg',
      type: 'smoothstep'
    },
    {
      id: 'e2-3',
      source: 'welcome-msg',
      target: 'intent-classifier',
      type: 'smoothstep'
    }
  ]
}

export const availableTemplates = [
  basicChatbotTemplate,
  customerSupportTemplate
]

// 导出消息模板以便其他地方使用
export const defaultMessageTemplates = messageTemplates