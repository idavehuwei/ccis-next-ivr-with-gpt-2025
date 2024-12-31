<!-- src/components/nodes/SendWaitReplyNode.vue -->
<template>
    <BaseNode
      type="send_wait_reply"
      :title="data.label || 'Send & Wait For Reply'"
      :is-selected="isSelected"
    >
      <template #icon>
        <MessageCircleIcon class="w-5 h-5 text-blue-500" />
      </template>
  
      <template #default>
        <div class="p-4 space-y-4">
          <!-- Message Configuration -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Message Body</label>
            <textarea
              v-model="nodeData.message.body"
              rows="3"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="Enter message content..."
              @change="updateNode"
            />
          </div>
  
          <!-- Media URL -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Media URL (Optional)</label>
            <input
              v-model="nodeData.message.mediaUrl"
              type="url"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="https://example.com/media.jpg"
              @change="updateNode"
            />
          </div>
  
          <!-- Wait Configuration -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Stop Gathering After (seconds)</label>
            <input
              v-model.number="nodeData.wait.timeout"
              type="number"
              min="1"
              max="14400"
              class="w-full px-3 py-2 border rounded-md"
              @change="updateNode"
            />
            <p class="mt-1 text-xs text-gray-500">
              Best practice: limit timeout to 4 hours (14400 seconds) or less
            </p>
          </div>
  
          <!-- Optional Chat Configuration -->
          <div v-if="isChatChannel">
            <div>
              <label class="block text-sm font-medium text-gray-700">Chat Service SID</label>
              <input
                v-model="nodeData.message.chatService"
                type="text"
                class="w-full px-3 py-2 border rounded-md"
                @change="updateNode"
              />
            </div>
            
            <div class="mt-2">
              <label class="block text-sm font-medium text-gray-700">Chat Channel SID</label>
              <input
                v-model="nodeData.message.chatChannel"
                type="text"
                class="w-full px-3 py-2 border rounded-md"
                @change="updateNode"
              />
            </div>
          </div>
        </div>
      </template>
  
      <!-- Connection Points -->
      <template #handles>
        <Handle
          type="source"
          :position="Position.Bottom"
          id="reply"
          class="handle-success"
        >
          <span class="handle-label">Reply</span>
        </Handle>
        
        <Handle
          type="source"
          :position="Position.Bottom"
          id="no_reply"
          class="handle-warning"
        >
          <span class="handle-label">No Reply</span>
        </Handle>
        
        <Handle
          type="source"
          :position="Position.Bottom"
          id="delivery_fails"
          class="handle-error"
        >
          <span class="handle-label">Delivery Fails</span>
        </Handle>
      </template>
    </BaseNode>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Handle, Position } from '@vue-flow/core'
  import { MessageCircle as MessageCircleIcon } from 'lucide-vue-next'
  import BaseNode from './BaseNode.vue'
  import { SendWaitReplyData } from '@/types';  
  
  const props = defineProps<{
    id: string
    data: SendWaitReplyData
    isSelected?: boolean
  }>()
  
  const emit = defineEmits(['update'])
  
  // 默认配置
  const defaultConfig: SendWaitReplyData = {
    label: 'Send & Wait For Reply',
    message: {
      body: '',
      from: '{{flow.channel.address}}'
    },
    wait: {
      timeout: 3600
    }
  }
  
  const nodeData = ref({...defaultConfig, ...props.data})
  
  // 是否是聊天渠道
  const isChatChannel = computed(() => {
    return props.data.message?.chatService || props.data.message?.chatChannel
  })
  
  const updateNode = () => {
    emit('update', {
      ...props.data,
      ...nodeData.value
    })
  }
  </script>