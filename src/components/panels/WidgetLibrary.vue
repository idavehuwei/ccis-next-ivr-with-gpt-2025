<!-- src/components/panels/WidgetLibrary.vue -->
<template>
  <div class="bg-white border-l w-80 flex flex-col h-full">
    <!-- Panel Header -->
    <div class="p-4 border-b">
      <div class="flex items-center justify-between">
        <h2 class="font-medium text-gray-900">Add Widget</h2>
        <button 
          @click="$emit('hide')" 
          class="text-blue-600 hover:text-blue-700 text-sm"
        >
          Hide
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="px-4 py-3 border-b">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search widgets..."
          class="w-full px-3 py-2 pl-9 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          @input="filterComponents"
        />
        <svg 
          class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Component List with Scroll -->
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <!-- Flow Control Section -->
      <div v-if="filteredFlowControlComponents.length > 0" class="p-4 border-b">
        <div class="flex items-center mb-3">
          <svg class="w-4 h-4 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 6h16M4 12h16M4 18h16" stroke-width="2"/>
          </svg>
          <span class="text-sm font-medium text-gray-700">FLOW CONTROL</span>
        </div>
        <div class="space-y-2">
          <button
            v-for="component in filteredFlowControlComponents"
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

      <!-- Voice Widgets -->
      <div v-if="filteredVoiceComponents.length > 0" class="p-4 border-b">
        <div class="flex items-center mb-3">
          <svg class="w-4 h-4 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" stroke-width="2"/>
          </svg>
          <span class="text-sm font-medium text-gray-700">VOICE</span>
        </div>
        <div class="space-y-2">
          <button
            v-for="component in filteredVoiceComponents"
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

      <!-- Messaging Widgets -->
      <div v-if="filteredMessagingComponents.length > 0" class="p-4 border-b">
        <div class="flex items-center mb-3">
          <svg class="w-4 h-4 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke-width="2"/>
          </svg>
          <span class="text-sm font-medium text-gray-700">MESSAGING</span>
        </div>
        <div class="space-y-2">
          <button
            v-for="component in filteredMessagingComponents"
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

      
      <div v-if="filteredApiComponents.length > 0" class="p-4 border-b">
        <div class="flex items-center mb-3">
          <svg class="w-4 h-4 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-sm font-medium text-gray-700">API REQUESTS</span>
        </div>
        <div class="space-y-2">
          <button
            v-for="component in filteredApiComponents"
            :key="component.type"
            class="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-all hover:translate-y-[-1px]"
            @click="addNode(component.type)"
          >
            <div class="w-8 h-8 rounded flex items-center justify-center mr-3 text-white font-bold"
                :class="component.iconClass">
              {{ component.icon }}
            </div>
            <div>
              <span class="text-gray-700">{{ component.name }}</span>
              <p class="text-sm text-gray-500">{{ component.description }}</p>
            </div>
          </button>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-if="showNoResults" class="p-8 text-center text-gray-500">
        No widgets found matching "{{ searchQuery }}"
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { v4 as uuidv4 } from 'uuid'

const emit = defineEmits<{
  (e: 'hide'): void
}>()

const { addNodes } = useVueFlow()

const searchQuery = ref('')

// Flow Control Components
const flowControlComponents = [
  {
    type: 'split',
    name: '根据...拆分',
    icon: 'S',
    iconClass: 'bg-blue-500'
  },
  {
    type: 'set_variables',
    name: '设置变量',
    icon: 'V',
    iconClass: 'bg-blue-500'
  },
  {
    type: 'subflow',
    name: '运行子流程',
    icon: 'R',
    iconClass: 'bg-blue-500'
  },
  {
    type: 'fork_stream',
    name: '分叉流',
    icon: 'F',
    iconClass: 'bg-blue-500'
  },
  {
    type: 'connect_virtual_agent',
    name: '连接虚拟Agent',
    icon: 'A',
    iconClass: 'bg-blue-500'
  }
];

const voiceComponents = [
  {
    type: 'gather_input',
    name: '通话中收集输入',
    icon: 'G',
    iconClass: 'bg-green-500'
  },
  {
    type: 'connect_call',
    name: '连接通话',
    icon: 'C',
    iconClass: 'bg-green-500'
  },
  {
    type: 'record',
    name: '记录语音邮件',
    icon: 'R',
    iconClass: 'bg-green-500'
  },

  {
    type: 'wait_for_reply',
    name: 'Wait For Reply',
    icon: 'W',
    iconClass: 'bg-indigo-500',
    description: 'Wait for user response with timeout'
  },

  {
    type: 'say_play',
    name: '说/播放',
    icon: 'P',
    iconClass: 'bg-green-500'
  },
  {
    type: 'make_call',
    name: '拨出电话',
    icon: 'O',
    iconClass: 'bg-green-500'
  },
  {
    type: 'call_recording',
    name: '通话录音',
    icon: 'C',
    iconClass: 'bg-green-500'
  },
  {
    type: 'enqueue_call',
    name: 'Enqueue Call',
    icon: 'Q',
    iconClass: 'bg-green-500',
    description: 'Add caller to a queue'
  }
];

// Messaging Components
const messagingComponents = [
  {
    type: 'trigger',
    name: '触发器',
    icon: 'T',
    iconClass: 'bg-red-500'
  },
  {
    type: 'send_message',
    name: '发送消息',
    icon: 'M',
    iconClass: 'bg-blue-500'
  },
  {
    type: 'send_and_wait',
    name: '发送并等待回复',
    icon: 'W',
    iconClass: 'bg-purple-500',
    description: 'Send a message and wait for response'
  },
  {
    type: 'collect_input',
    name: '收集输入',
    icon: 'C',
    iconClass: 'bg-green-500',
    description: 'Collect and validate user input'
  },
  {
    type: 'split_intent',
    name: '意图分析',
    icon: 'AI',
    iconClass: 'bg-purple-500',
    description: 'Route based on message intent'
  }
];

// API Request Components
const apiComponents = [

{
    type: 'trigger',
    name: 'Trigger Request',
    icon: 'H',
    iconClass: 'bg-yellow-500',
    description: 'Make an HTTP request to an external service'
  },

  {
    type: 'http_request',
    name: 'Make HTTP Request',
    icon: 'H',
    iconClass: 'bg-yellow-500',
    description: 'Make an HTTP request to an external service'
  },
  {
    type: 'run_function',
    name: 'Run Function',
    icon: 'F',
    iconClass: 'bg-orange-500',
    description: 'Execute a serverless function from your services'
  }
]

// Filtered Components
const filteredFlowControlComponents = computed(() => {
  return filterComponentsBySearch(flowControlComponents)
})

const filteredVoiceComponents = computed(() => {
  return filterComponentsBySearch(voiceComponents)
})

const filteredMessagingComponents = computed(() => {
  return filterComponentsBySearch(messagingComponents)
})

const filteredApiComponents = computed(() => {
  return filterComponentsBySearch(apiComponents)
})

const showNoResults = computed(() => {
  return searchQuery.value !== '' && 
         filteredFlowControlComponents.value.length === 0 &&
         filteredVoiceComponents.value.length === 0 &&
         filteredMessagingComponents.value.length === 0 &&
         filteredApiComponents.value.length === 0
})

// Filter Function
function filterComponentsBySearch(components: any[]) {
  if (!searchQuery.value) return components
  
  const query = searchQuery.value.toLowerCase()
  return components.filter(component => 
    component.name.toLowerCase().includes(query) ||
    component.type.toLowerCase().includes(query)
  )
}

// Add Node Function
const addNode = (type: string) => {
  const newNode = {
    id: `${type}-${uuidv4()}`,
    type,
    position: { x: 100, y: 100 },
    data: getDefaultNodeData(type)
  }
  
  addNodes([newNode])
  emit('hide')
}

// Get Default Node Data
const getDefaultNodeData = (type: string) => {
  switch (type) {
    case 'send_message':
      return {
        label: 'Send Message',
        message: '',
        mediaUrl: ''
      }
    case 'connect_call':
      return {
        label: 'Connect Call To',
        number: '',
        timeout: 30
      }
    case 'gather_input':
      return {
        label: 'Gather Input',
        prompt: '',
        timeout: 5,
        finishOnKey: '#'
      }
    case 'set_variables':
      return {
        label: 'Set Variables',
        variables: {}
      }
    case 'split':
      return {
        label: 'Split Based On...',
        variable: '',
        conditions: []
      }
    case 'record_call':
      return {
        label: 'Call Recording',
        action: 'start',
        channels: 'mono',
        trim: false,
        playBeep: false
      }
    default:
      return {
        label: type.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      }
  }
}
</script>

<style scoped>
/* Custom Scrollbar Styles */
.custom-scrollbar {
  scrollbar-width: thin;  /* Firefox */
  scrollbar-color: #CBD5E1 transparent;  /* Firefox */
}

/* Webkit browsers (Chrome, Safari) */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #CBD5E1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94A3B8;
}

</style> 