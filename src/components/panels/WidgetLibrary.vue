<!-- src/components/panels/WidgetLibrary.vue -->
<template>
  <div class="bg-white border-l w-80 flex flex-col h-full">
    <!-- Panel Header -->
    <div class="p-4 border-b">
      <div class="flex items-center justify-between">
        <h2 class="font-medium text-gray-900">添加组件</h2>
        <button 
          @click="$emit('hide')" 
          class="text-blue-600 hover:text-blue-700 text-sm"
        >
          Hide
        </button>
      </div>
    </div>

    <!-- Component List -->
    <div class="flex-1 overflow-y-auto">
      <!-- Flow Control Section -->
      <div class="p-4 border-b">
        <div class="flex items-center mb-3">
          <svg class="w-4 h-4 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 6h16M4 12h16M4 18h16" stroke-width="2"/>
          </svg>
          <span class="text-sm font-medium text-gray-700">FLOW CONTROL</span>
        </div>
        <div class="space-y-2">
          <button
            v-for="component in flowControlComponents"
            :key="component.type"
            class="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-all hover:translate-y-[-1px]"
            @click="addNode(component.type)"
          >
            <div class="w-8 h-8 rounded flex items-center justify-center mr-3 text-white font-bold"
                 :class="component.iconClass">
              {{ component.icon }}
            </div>
            <span class="text-gray-700">{{ component.name }}</span>
          </button>
        </div>
      </div>

      <!-- Voice Section -->
      <div class="p-4 border-b">
        <div class="flex items-center mb-3">
          <svg class="w-4 h-4 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" stroke-width="2"/>
          </svg>
          <span class="text-sm font-medium text-gray-700">VOICE</span>
        </div>
        <div class="space-y-2">
          <button
            v-for="component in voiceComponents"
            :key="component.type"
            class="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-all hover:translate-y-[-1px]"
            @click="addNode(component.type)"
          >
            <div class="w-8 h-8 rounded flex items-center justify-center mr-3 text-white font-bold"
                 :class="component.iconClass">
              {{ component.icon }}
            </div>
            <span class="text-gray-700">{{ component.name }}</span>
          </button>
        </div>
      </div>

      <!-- Messaging Section -->
      <div class="p-4">
        <div class="flex items-center mb-3">
          <svg class="w-4 h-4 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke-width="2"/>
          </svg>
          <span class="text-sm font-medium text-gray-700">MESSAGING</span>
        </div>
        <div class="space-y-2">
          <button
            v-for="component in messagingComponents"
            :key="component.type"
            class="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-all hover:translate-y-[-1px]"
            @click="addNode(component.type)"
          >
            <div class="w-8 h-8 rounded flex items-center justify-center mr-3 text-white font-bold"
                 :class="component.iconClass">
              {{ component.icon }}
            </div>
            <span class="text-gray-700">{{ component.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVueFlow } from '@vue-flow/core'
import { v4 as uuidv4 } from 'uuid'

const emit = defineEmits<{
  (e: 'hide'): void
}>()

const { addNodes } = useVueFlow()

const flowControlComponents = [
  {
    type: 'split',
    name: 'Split Based On...',
    icon: 'S',
    iconClass: 'bg-blue-500'
  },
  {
    type: 'variables',
    name: 'Set Variables',
    icon: 'V',
    iconClass: 'bg-blue-500'
  },
  {
    type: 'subflow',
    name: 'Run Subflow',
    icon: 'R',
    iconClass: 'bg-blue-500'
  },
  {
    type: 'fork_stream',
    name: 'Fork Stream',
    icon: 'F',
    iconClass: 'bg-blue-500'
  },
  {
    type: 'connect_virtual_agent',
    name: 'Connect Virtual Agent',
    icon: 'A',
    iconClass: 'bg-blue-500'
  }
]


const voiceComponents = [
  {
    type: 'gather_input',
    name: 'Gather Input on Call',
    icon: 'G',
    iconClass: 'bg-green-500'
  },
  {
    type: 'connect_call',
    name: 'Connect Call To',
    icon: 'C',
    iconClass: 'bg-green-500'
  },
  {
    type: 'record',
    name: 'Record Voicemail',
    icon: 'R',
    iconClass: 'bg-green-500'
  },
  {
    type: 'say_play',
    name: 'Say/Play',
    icon: 'P',
    iconClass: 'bg-green-500'
  },
  {
    type: 'make_call',
    name: 'Make Outgoing Call',
    icon: 'O',
    iconClass: 'bg-green-500'
  },
  {
    type: 'call_recording',
    name: 'Call Recording',
    icon: 'C',
    iconClass: 'bg-green-500'
  },
  {
    type: 'enqueue_call',
    name: 'Enqueue Call',
    icon: 'E',
    iconClass: 'bg-green-500'
  }
]


const messagingComponents = [
  {
    type: 'trigger',
    name: '触发器',
    icon: 'T',
    iconClass: 'bg-red-500'
  },
  {
    type: 'send_reply',
    name: '发送并等待回复',
    icon: 'R',
    iconClass: 'bg-purple-500'
  }
]

const addNode = (type: string) => {
  const newNode = {
    id: `${type}-${uuidv4()}`,
    type,
    position: { x: 100, y: 100 },
    data: { 
      label: getDefaultLabel(type),
      trigger: 'Incoming Message',
      waitTime: 30,
      replyContent: ''
    }
  }
  
  addNodes([newNode])
}

const getDefaultLabel = (type: string) => {
  switch (type) {
    case 'trigger':
      return 'Trigger'
    case 'send_reply':
      return 'Send & Reply'
    case 'split':
      return 'Split'
    case 'variables':
      return 'Variables'
    case 'subflow':
      return 'Subflow'
    case 'gather_input':
      return 'Gather Input'
    case 'connect_call':
      return 'Connect Call'
    case 'record':
      return 'Record'
    case 'say_play':
      return 'Say/Play'
    default:
      return type
  }
}
</script>