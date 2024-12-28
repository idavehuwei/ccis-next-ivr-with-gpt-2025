<!-- src/components/nodes/ForkStreamNode.vue -->
<template>
    <div class="relative">
      <div class="bg-white rounded-lg min-w-[300px] border-2" 
           :class="{ 'border-purple-500 ring-2 ring-purple-500': isSelected, 'border-gray-200': !isSelected }">
        <!-- Header -->
        <div class="bg-purple-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" 
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-medium text-base">{{ nodeData.label || 'Fork Stream' }}</span>
            <button class="w-5 h-5 text-white/80 hover:text-white">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
  
        <!-- Content -->
        <div class="p-4">
          <div class="space-y-4">
            <!-- Description -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">DESCRIPTION</label>
              <input
                type="text"
                v-model="nodeData.description"
                placeholder="Fork stream description..."
                class="w-full px-3 py-2 border rounded text-sm"
                @change="updateNode"
              />
            </div>
  
            <!-- Fork Streams Configuration -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-xs font-medium text-gray-500">STREAMS</label>
                <button 
                  @click="addStream"
                  class="text-purple-600 hover:text-purple-700 text-sm"
                >
                  Add Stream
                </button>
              </div>
  
              <div class="space-y-3">
                <div v-for="(stream, index) in nodeData.streams" :key="index"
                     class="border rounded-lg p-3 bg-gray-50">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center">
                      <span class="w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                        {{ index + 1 }}
                      </span>
                      <input
                        type="text"
                        v-model="stream.name"
                        placeholder="Stream name"
                        class="ml-2 px-2 py-1 border rounded text-sm"
                        @change="updateNode"
                      />
                    </div>
                    <button 
                      @click="removeStream(index)"
                      class="text-red-500 hover:text-red-600"
                    >
                      <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                      </svg>
                    </button>
                  </div>
  
                  <!-- Stream Settings -->
                  <div class="space-y-2">
                    <label class="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        v-model="stream.waitForCompletion"
                        class="text-purple-500 rounded focus:ring-purple-500"
                        @change="updateNode"
                      />
                      <span class="text-sm text-gray-700">Wait for completion</span>
                    </label>
                    
                    <div v-if="stream.waitForCompletion">
                      <label class="block text-xs text-gray-500 mb-1">TIMEOUT (SECONDS)</label>
                      <input
                        type="number"
                        v-model.number="stream.timeout"
                        min="1"
                        max="300"
                        class="w-32 px-2 py-1 border rounded text-sm"
                        @change="updateNode"
                      />
                    </div>
  
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">ERROR HANDLING</label>
                      <select
                        v-model="stream.errorHandling"
                        class="w-full px-2 py-1 border rounded text-sm"
                        @change="updateNode"
                      >
                        <option value="continue">Continue execution</option>
                        <option value="stop">Stop execution</option>
                        <option value="retry">Retry stream</option>
                      </select>
                    </div>
                  </div>
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
        class="w-3 h-3 !bg-purple-500"
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
            class="w-3 h-3 !bg-purple-500 cursor-pointer hover:scale-110 transition-transform"
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
      description?: string
      streams?: Array<{
        name: string
        waitForCompletion: boolean
        timeout?: number
        errorHandling: 'continue' | 'stop' | 'retry'
      }>
    }
    isSelected?: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update', id: string, data: any): void
  }>()
  
  // 默认值
  const defaultData = {
    label: 'Fork Stream',
    description: '',
    streams: [
      {
        name: 'Stream 1',
        waitForCompletion: true,
        timeout: 60,
        errorHandling: 'continue'
      }
    ]
  }
  
  // 使用ref来存储节点数据
  const nodeData = ref({...defaultData})
  
  // 监听props.data的变化
  watch(() => props.data, (newData) => {
    nodeData.value = {
      ...defaultData,
      ...newData,
      streams: newData?.streams || defaultData.streams
    }
  }, { immediate: true, deep: true })
  
  // Output connection points configuration
  const outputs = [
    { 
      id: 'completed', 
      label: 'Completed',
      class: 'bg-green-100 text-green-700'
    },
    { 
      id: 'error', 
      label: 'Error',
      class: 'bg-red-100 text-red-700'
    }
  ]
  
  // Stream management
  const addStream = () => {
    const streamCount = nodeData.value.streams.length
    nodeData.value.streams.push({
      name: `Stream ${streamCount + 1}`,
      waitForCompletion: true,
      timeout: 60,
      errorHandling: 'continue'
    })
    updateNode()
  }
  
  const removeStream = (index: number) => {
    nodeData.value.streams.splice(index, 1)
    updateNode()
  }
  
  // Update node data
  const updateNode = () => {
    emit('update', props.id, nodeData.value)
  }
  </script>