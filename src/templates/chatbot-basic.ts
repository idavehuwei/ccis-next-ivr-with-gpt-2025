// src/templates/chatbot-basic.ts
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
        id: 'nlp-1',
        type: 'nlp_intent',
        position: { x: 250, y: 150 },
        data: {
          label: 'Classify Intent',
          service: 'dialogflow',
          intents: [
            { name: 'greeting', confidence: '0.7' },
            { name: 'help', confidence: '0.7' },
            { name: 'goodbye', confidence: '0.7' }
          ]
        }
      },
      {
        id: 'msg-greeting',
        type: 'send_message',
        position: { x: 100, y: 300 },
        data: {
          label: 'Send Greeting',
          message: 'Hello! How can I help you today?'
        }
      },
      {
        id: 'msg-help',
        type: 'send_message', 
        position: { x: 250, y: 300 },
        data: {
          label: 'Send Help',
          message: 'I can help you with:\n- Product information\n- Order status\n- Customer support'
        }
      },
      {
        id: 'msg-goodbye',
        type: 'send_message',
        position: { x: 400, y: 300 },
        data: {
          label: 'Send Goodbye',
          message: 'Goodbye! Have a great day!'
        }
      },
      {
        id: 'msg-fallback',
        type: 'send_message',
        position: { x: 550, y: 300 },
        data: {
          label: 'Send Fallback',
          message: 'I\'m not sure I understand. Could you rephrase that?'
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: 'trigger-1',
        target: 'nlp-1',
        type: 'smoothstep'
      },
      {
        id: 'e2-3',
        source: 'nlp-1',
        target: 'msg-greeting',
        sourceHandle: 'greeting',
        type: 'smoothstep'
      },
      {
        id: 'e2-4',
        source: 'nlp-1',
        target: 'msg-help',
        sourceHandle: 'help',
        type: 'smoothstep'
      },
      {
        id: 'e2-5',
        source: 'nlp-1',
        target: 'msg-goodbye',
        sourceHandle: 'goodbye',
        type: 'smoothstep'
      },
      {
        id: 'e2-6',
        source: 'nlp-1',
        target: 'msg-fallback',
        sourceHandle: 'fallback',
        type: 'smoothstep'
      }
    ]
  }
  
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