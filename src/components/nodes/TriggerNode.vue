<!-- src/components/nodes/TriggerNode.vue -->
<template>
  <div class="relative">
    <div class="bg-white rounded-lg min-w-[300px] shadow-sm" 
         :class="{ 'ring-2 ring-blue-500': isSelected }">
      <!-- Header -->
      <div class="bg-red-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <span class="font-medium text-base">Trigger</span>
          <button class="w-5 h-5 text-white/80 hover:text-white">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <button class="text-white/80 hover:text-white">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>

      <!-- Trigger Options -->
      <div class="p-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="option in triggerOptions"
            :key="option.type"
            class="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors"
            :class="[
              option.type === selectedTrigger 
                ? 'bg-red-500 text-white' 
                : 'bg-red-50 text-red-500 hover:bg-red-100'
            ]"
            @click="selectTrigger(option.type)"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" v-html="option.icon"/>
            {{ option.name }}
            <span class="w-4 h-4 border-[1.5px] border-current rounded-full flex items-center justify-center text-xs">?</span>
          </button>
        </div>

        <!-- Selected Trigger Configuration -->
        <div v-if="selectedTrigger" class="mt-4 space-y-4">
          <!-- Webhook Configuration -->
          <div v-if="selectedTrigger === 'webhook'" class="bg-gray-50 rounded p-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Webhook URL
            </label>
            <input
              type="text"
              v-model="nodeData.webhookUrl"
              placeholder="https://your-domain.com/webhook"
              class="w-full px-3 py-2 border rounded-md text-sm"
              @change="updateNode"
            />
          </div>

          <!-- Schedule Configuration -->
          <div v-if="selectedTrigger === 'schedule'" class="bg-gray-50 rounded p-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Schedule Type
              </label>
              <select 
                v-model="nodeData.scheduleType"
                class="w-full px-3 py-2 border rounded-md text-sm"
                @change="updateNode"
              >
                <option value="cron">Cron Expression</option>
                <option value="interval">Interval</option>
                <option value="fixed">Fixed Time</option>
              </select>
              
              <div v-if="nodeData.scheduleType === 'cron'">
                <input
                  type="text"
                  v-model="nodeData.cronExpression"
                  placeholder="* * * * *"
                  class="w-full px-3 py-2 border rounded-md text-sm"
                  @change="updateNode"
                />
              </div>
            </div>
          </div>

          <!-- Channel-specific Configuration -->
          <div v-if="['facebook', 'whatsapp'].includes(selectedTrigger)" class="bg-gray-50 rounded p-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Message Types
            </label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="nodeData.messageTypes.text"
                  class="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  @change="updateNode"
                />
                <span class="ml-2 text-sm text-gray-600">Text Messages</span>
              </label>
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="nodeData.messageTypes.media"
                  class="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  @change="updateNode"
                />
                <span class="ml-2 text-sm text-gray-600">Media Messages</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Connection Points -->
    <div class="flex justify-around mt-3">
      <div 
        v-for="(output, index) in getOutputs()" 
        :key="output.id"
        class="flex flex-col items-center"
      >
        <Handle
          type="source"
          :position="Position.Bottom"
          :id="output.id"
          class="w-3 h-3 !bg-red-500 cursor-pointer hover:scale-110 transition-transform"
        />
        <span class="mt-1 text-xs text-gray-500">{{ output.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Position, Handle } from '@vue-flow/core'

const props = defineProps<{
  isSelected?: boolean
}>()

const emit = defineEmits<{
  (e: 'select-trigger', type: string): void
}>()

const triggerOptions = [
  {
    type: 'incoming_message',
    name: 'Incoming Message',
    icon: '<path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2"/>'
  },
  {
    type: 'incoming_call',
    name: 'Incoming Call',
    icon: '<path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-width="2"/>'
  },
  {
    type: 'webhook',
    name: 'Webhook',
    icon: '<path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  {
    type: 'facebook',
    name: 'Facebook Message',
    icon: '<path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  {
    type: 'whatsapp',
    name: 'WhatsApp Message',
    icon: '<path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  {
    type: 'schedule',
    name: 'Scheduled Task',
    icon: '<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  {
    type: 'api',
    name: 'REST API',
    icon: '<path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  {
    type: 'conversation',
    name: 'Conversation',
    icon: '<path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  }
]

// 节点数据
const nodeData = ref({
  webhookUrl: '',
  scheduleType: 'cron',
  cronExpression: '* * * * *',
  messageTypes: {
    text: true,
    media: false
  }
})

const selectedTrigger = ref('incoming_message')

const selectTrigger = (type: string) => {
  selectedTrigger.value = type
  emit('select-trigger', type)
}

// 获取输出连接点
const getOutputs = () => {
  const baseOutputs = [
    { id: 'success', label: 'Success' }
  ]

  // 根据触发器类型添加额外的输出
  switch (selectedTrigger.value) {
    case 'webhook':
    case 'api':
      return [
        ...baseOutputs,
        { id: 'error', label: 'Error' }
      ]
    case 'schedule':
      return [
        ...baseOutputs,
        { id: 'timeout', label: 'Timeout' }
      ]
    default:
      return baseOutputs
  }
}

const updateNode = () => {
  emit('update', props.id, {
    ...nodeData.value,
    triggerType: selectedTrigger.value
  })
}
</script>