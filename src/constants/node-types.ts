export const NODE_TYPES = {
  TRIGGER: {
    type: 'trigger',
    name: 'Trigger',
    category: 'Flow Control',
    description: 'Start your flow with an incoming call, message, or API request',
    allowedInputs: ['incoming_call', 'incoming_message', 'rest_api'],
    maxOutputs: 1,
    color: 'red'
  },
  GATHER_INPUT: {
    type: 'gather_input',
    name: 'Gather Input',
    category: 'Voice',
    description: 'Collect DTMF or speech input from the caller',
    outputs: ['input_received', 'no_input', 'invalid'],
    maxOutputs: 3,
    color: 'green'
  },
  PLAY_MESSAGE: {
    type: 'play_message',
    name: 'Play Message',
    category: 'Voice',
    description: 'Play audio or text-to-speech message',
    maxOutputs: 1,
    color: 'blue'
  },
  SPLIT: {
    type: 'split',
    name: 'Split Based On...',
    category: 'Flow Control', 
    description: 'Route your flow based on conditions',
    maxOutputs: 'unlimited',
    color: 'purple'
  },
  CONNECT_CALL: {
    type: 'connect_call',
    name: 'Connect Call To',
    category: 'Voice',
    description: 'Transfer the call to another number or SIP endpoint',
    outputs: ['connected', 'busy', 'no_answer', 'failed'],
    maxOutputs: 4,
    color: 'orange'
  },
  RECORD: {
    type: 'record',
    name: 'Record',
    category: 'Voice',
    description: 'Record voice input or conversation',
    outputs: ['completed', 'failed'],
    maxOutputs: 2,
    color: 'pink'
  },
  SEND_MESSAGE: {
    type: 'send_message',
    name: 'Send Message',
    category: 'Messaging',
    description: 'Send an SMS or WhatsApp message',
    outputs: ['sent', 'failed'],
    maxOutputs: 2,
    color: 'indigo'
  },
  HTTP_REQUEST: {
    type: 'http_request',
    name: 'Make HTTP Request',
    category: 'Integration',
    description: 'Call an external API',
    outputs: ['success', 'failed'],
    maxOutputs: 2,
    color: 'yellow'
  },

  SET_VARIABLES: {
    type: 'set_variables',
    name: 'Set Variables',
    defaultData: {
      label: 'set_variables_1',
      variables: {}
    }
  }

} as const;

export type NodeType = keyof typeof NODE_TYPES;

export interface IVRNode {
  id: string;
  type: NodeType;
  position: {
    x: number;
    y: number;
  };
  data: {
    label?: string;
    trigger?: string;
    waitTime?: number;
    replyContent?: string;
    conditions?: Array<{
      value: string;
      target: string;
    }>;
    [key: string]: any;
  };
}

export interface IVREdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  data?: {
    condition?: string;
    priority?: number;
  };
}