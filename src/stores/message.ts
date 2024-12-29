import { defineStore } from 'pinia'
import type { MessageTemplate, MessageVariable, QueuedMessage } from '@/types/message'

export const useMessageStore = defineStore('message', {
  state: () => ({
    templates: [] as MessageTemplate[],
    variables: [] as MessageVariable[],
    queue: [] as QueuedMessage[],
    defaultVariables: [
      { name: 'customer_name', type: 'string', value: '', description: '客户名称' },
      { name: 'order_id', type: 'string', value: '', description: '订单编号' }
    ] as MessageVariable[]
  }),

  getters: {
    getTemplateById: (state) => (id: string) => {
      return state.templates.find(t => t.id === id)
    },
    
    getVariablesByTemplate: (state) => (templateId: string) => {
      const template = state.templates.find(t => t.id === templateId)
      return template ? template.variables.map(name => 
        state.variables.find(v => v.name === name)
      ).filter(Boolean) : []
    },

    pendingMessages: (state) => {
      return state.queue.filter(m => m.status === 'pending')
    }
  },

  actions: {
    saveTemplate(template: MessageTemplate) {
      const index = this.templates.findIndex(t => t.id === template.id)
      if (index > -1) {
        this.templates[index] = template
      } else {
        this.templates.push(template)
      }
    },

    deleteTemplate(id: string) {
      const index = this.templates.findIndex(t => t.id === id)
      if (index > -1) {
        this.templates.splice(index, 1)
      }
    },

    addToQueue(message: QueuedMessage) {
      this.queue.push(message)
    },

    updateMessageStatus(id: string, status: QueuedMessage['status']) {
      const message = this.queue.find(m => m.id === id)
      if (message) {
        message.status = status
        if (status === 'sent') {
          message.sentAt = new Date()
        }
      }
    },

    addVariable(variable: MessageVariable) {
      if (!this.variables.find(v => v.name === variable.name)) {
        this.variables.push(variable)
      }
    },

    // 批量导入模板
    importTemplates(templates: MessageTemplate[]) {
      templates.forEach(template => {
        this.saveTemplate(template)
      })
    },

    // 清理已发送的消息
    cleanSentMessages() {
      this.queue = this.queue.filter(m => m.status !== 'sent')
    },

    // 重试失败的消息
    retryFailedMessage(id: string) {
      const message = this.queue.find(m => m.id === id && m.status === 'failed')
      if (message) {
        message.status = 'pending'
      }
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'message-store',
        storage: localStorage,
        paths: ['templates', 'variables']
      }
    ]
  }
}) 