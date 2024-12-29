export type TemplateType = 'text' | 'media' | 'mixed' | 'interactive'

export interface VariableValidation {
  required?: boolean
  pattern?: RegExp
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  mediaUrls?: string[];
  type: TemplateType;
  category?: string;
  tags?: string[];
  validation?: Record<string, VariableValidation>;
  created?: Date;
  updated?: Date;
}

export interface MessageVariable {
  name: string;
  value: string;
  type: 'string' | 'number' | 'boolean';
  description?: string;
}

export interface QueuedMessage {
  id: string;
  templateId: string;
  variables: Record<string, any>;
  status: 'pending' | 'sent' | 'failed';
  createdAt: Date;
  sentAt?: Date;
}

export interface MessageSendResult {
  id: string;
  success: boolean;
  error?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
} 