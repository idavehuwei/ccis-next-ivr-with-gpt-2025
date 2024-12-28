<!-- src/components/nodes/EnqueueCallNode.vue -->
<template>
    <div class="relative">
      <div class="bg-white rounded-lg min-w-[300px] border-2" 
           :class="{ 'border-teal-500 ring-2 ring-teal-500': isSelected, 'border-gray-200': !isSelected }">
        <!-- Header -->
        <div class="bg-teal-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" 
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-medium text-base">{{ nodeData.label || 'Enqueue Call' }}</span>
          </div>
          <button class="text-white/80 hover:text-white">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
        </div>
  
        <!-- Content -->
        <div class="p-4">
          <div class="space-y-4">
            <!-- Queue Selection -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">QUEUE NAME</label>
              <select 
                v-model="nodeData.queueName"
                class="w-full px-3 py-2 border rounded text-sm"
                @change="updateNode"
              >
                <option value="">Select a queue...</option>
                <option v-for="queue in queueOptions" :key="queue.id" :value="queue.id">
                  {{ queue.name }}
                </option>
              </select>
            </div>
  
            <!-- Priority -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">PRIORITY</label>
              <input
                type="number"
                v-model.number="nodeData.priority"
                min="1"
                max="100"
                class="w-full px-3 py-2 border rounded text-sm"
                @change="updateNode"
              />
              <p class="mt-1 text-xs text-gray-500">
                Higher numbers indicate higher priority (1-100)
              </p>
            </div>
  
            <!-- Queue Options -->
            <div class="bg-gray-50 p-4 rounded-lg space-y-4">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">QUEUE OPTIONS</label>
              </div>
  
              <!-- Wait URL -->
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">WAIT URL</label>
                <input
                  type="url"
                  v-model="nodeData.waitUrl"
                  placeholder="https://example.com/wait-music"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
                <p class="mt-1 text-xs text-gray-500">
                  URL that hosts the audio to play while waiting
                </p>
              </div>
  
              <!-- Wait Time -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">MAX WAIT TIME</label>
                  <input
                    type="number"
                    v-model.number="nodeData.maxWaitTime"
                    min="0"
                    class="w-full px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">TIME UNIT</label>
                  <select
                    v-model="nodeData.timeUnit"
                    class="w-full px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  >
                    <option value="seconds">Seconds</option>
                    <option value="minutes">Minutes</option>
                  </select>
                </div>
              </div>
  
              <!-- Additional Options -->
              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="nodeData.announcePosition"
                    class="text-teal-500 rounded focus:ring-teal-500"
                    @change="updateNode"
                  />
                  <span class="text-sm text-gray-700">Announce position in queue</span>
                </label>
                
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    v-model="nodeData.announceWaitTime"
                    class="text-teal-500 rounded focus:ring-teal-500"
                    @change="updateNode"
                  />
                  <span class="text-sm text-gray-700">Announce estimated wait time</span>
                </label>
              </div>
            </div>
  
            <!-- Customer Data -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-xs font-medium text-gray-500">CUSTOMER DATA</label>
                <button 
                  @click="addCustomData"
                  class="text-teal-600 hover:text-teal-700 text-sm"
                >
                  Add Data
                </button>
              </div>
              <div class="space-y-2">
                <div 
                  v-for="(data, index) in nodeData.customerData" 
                  :key="index"
                  class="flex items-center gap-2"
                >
                  <input
                    type="text"
                    v-model="data.key"
                    placeholder="Key"
                    class="flex-1 px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  />
                  <input
                    type="text"
                    v-model="data.value"
                    placeholder="Value"
                    class="flex-1 px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  />
                  <button 
                    @click="removeCustomData(index)"
                    class="text-red-600 hover:text-red-700"
                  >
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Connection Points -->
      <Handle
        type="target"
        :position="Position.Top"
        class="w-3 h-3 !bg-teal-500"
      />
      
      <!-- Output Handles -->
      <div class="flex justify-around mt-3">
        <div v-for="output in outputs" 
             :key="output.id" 
             class="flex flex-col items-center">
          <Handle
            type="source"
            :position="Position.Bottom"
            :id="output.id"
            class="w-3 h-3 !bg-teal-500 cursor-pointer hover:scale-110 transition-transform"
          />
          <span 
            class="mt-1 text-xs text-gray-500 px-2 py-0.5 rounded"
            :class="output.class"
          >
            {{ output.label }}
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { Handle, Position } from '@vue-flow/core'
  
  const props = defineProps<{
    id: string
    data: {
      label?: string
      queueName?: string
      priority?: number
      waitUrl?: string
      maxWaitTime?: number
      timeUnit?: 'seconds' | 'minutes'
      announcePosition?: boolean
      announceWaitTime?: boolean
      customerData?: Array<{
        key: string
        value: string
      }>
    }
    isSelected?: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update', id: string, data: any): void
  }>()
  
  // Mock queue options
  const queueOptions = [
    { id: 'support', name: 'Support Queue' },
    { id: 'sales', name: 'Sales Queue' },
    { id: 'service', name: 'Customer Service' }
  ]
  
  // 默认值
  const defaultData = {
    label: 'Enqueue Call',
    queueName: '',
    priority: 10,
    waitUrl: '',
    maxWaitTime: 300,
    timeUnit: 'seconds',
    announcePosition: false,
    announceWaitTime: false,
    customerData: []
  }
  
  // 使用ref来存储节点数据
  const nodeData = ref({...defaultData})
  
  // 监听props.data的变化
  watch(() => props.data, (newData) => {
    nodeData.value = {
      ...defaultData,
      ...newData,
      customerData: newData?.customerData || []
    }
  }, { immediate: true, deep: true })
  
  // Output connection points configuration
  const outputs = [
    { 
      id: 'enqueued', 
      label: 'Enqueued',
      class: 'bg-green-100 text-green-700'
    },
    { 
      id: 'timeout', 
      label: 'Timeout',
      class: 'bg-yellow-100 text-yellow-700'
    },
    { 
      id: 'error', 
      label: 'Error',
      class: 'bg-red-100 text-red-700'
    },
    {
      id: 'dequeued',
      label: 'Dequeued',
      class: 'bg-blue-100 text-blue-700'
    }
  ]
  
  // Custom data management
  const addCustomData = () => {
    nodeData.value.customerData.push({ key: '', value: '' })
    updateNode()
  }
  
  const removeCustomData = (index: number) => {
    nodeData.value.customerData.splice(index, 1)
    updateNode()
  }
  
  // Update node data
  const updateNode = () => {
    emit('update', props.id, nodeData.value)
  }
  </script>