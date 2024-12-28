<!-- src/components/nodes/CollectInputNode.vue -->
<template>
    <div class="relative">
      <div class="bg-white rounded-lg min-w-[300px] border-2" 
           :class="{ 'border-green-500 ring-2 ring-green-500': isSelected, 'border-gray-200': !isSelected }">
        <!-- Header -->
        <div class="bg-green-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M8 9l4-4 4 4m0 6l-4 4-4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-medium text-base">{{ data.label || 'Collect Input' }}</span>
          </div>
        </div>
  
        <!-- Content -->
        <div class="p-4">
          <div class="space-y-4">
            <!-- Prompt Message -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">PROMPT</label>
              <textarea
                v-model="data.prompt"
                rows="3"
                class="w-full px-3 py-2 border rounded text-sm"
                placeholder="Enter your prompt message..."
                @change="updateNode"
              ></textarea>
            </div>
  
            <!-- Input Settings -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">VALIDATION TYPE</label>
                <select
                  v-model="data.validationType"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                >
                  <option value="any">Any Input</option>
                  <option value="number">Number</option>
                  <option value="email">Email</option>
                  <option value="date">Date</option>
                  <option value="custom">Custom Pattern</option>
                </select>
              </div>
  
              <div v-if="data.validationType === 'custom'">
                <label class="block text-xs font-medium text-gray-500 mb-1">PATTERN</label>
                <input
                  type="text"
                  v-model="data.pattern"
                  placeholder="Regular expression"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
              </div>
            </div>
  
            <!-- Timeout Settings -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">TIMEOUT (SEC)</label>
                <input
                  type="number"
                  v-model.number="data.timeout"
                  min="1"
                  max="300"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">MAX ATTEMPTS</label>
                <input
                  type="number"
                  v-model.number="data.maxAttempts"
                  min="1"
                  max="5"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
              </div>
            </div>
  
            <!-- Validation Messages -->
            <div class="space-y-2">
              <label class="block text-xs font-medium text-gray-500">ERROR MESSAGES</label>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Invalid Input</label>
                <input
                  type="text"
                  v-model="data.messages.invalid"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Timeout</label>
                <input
                  type="text"
                  v-model="data.messages.timeout"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Connection Points -->
      <Handle
        type="target"
        :position="Position.Top"
        class="w-3 h-3 !bg-green-500"
      />
      
      <!-- Output Handles -->
      <div class="flex justify-around mt-3">
        <div v-for="output in outputs" :key="output.id" 
             class="flex flex-col items-center">
          <Handle
            type="source"
            :position="Position.Bottom"
            :id="output.id"
            class="w-3 h-3 !bg-green-500 cursor-pointer hover:scale-110 transition-transform"
          />
          <span class="mt-1 text-xs text-gray-500 px-2 py-0.5 rounded"
                :class="output.class">
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
      prompt?: string
      validationType?: 'any' | 'number' | 'email' | 'date' | 'custom'
      pattern?: string
      timeout?: number
      maxAttempts?: number
      messages?: {
        invalid: string
        timeout: string
      }
    }
    isSelected?: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update', id: string, data: any): void
  }>()
  
  // 默认值
  const defaultData = {
    label: 'Collect Input',
    prompt: 'Please provide your input:',
    validationType: 'any',
    pattern: '',
    timeout: 60,
    maxAttempts: 3,
    messages: {
      invalid: 'Invalid input. Please try again.',
      timeout: 'Time out. Please try again.'
    }
  }
  
  // 输出连接点配置
  const outputs = [
    { 
      id: 'valid', 
      label: 'Valid Input',
      class: 'bg-green-100 text-green-700'
    },
    { 
      id: 'invalid', 
      label: 'Invalid',
      class: 'bg-yellow-100 text-yellow-700'
    },
    { 
      id: 'timeout', 
      label: 'Timeout',
      class: 'bg-red-100 text-red-700'
    },
    { 
      id: 'max_attempts', 
      label: 'Max Attempts',
      class: 'bg-purple-100 text-purple-700'
    }
  ]
  
  // 使用ref来存储节点数据
  const nodeData = ref({...defaultData})
  
  // 监听props.data的变化
  watch(() => props.data, (newData) => {
    nodeData.value = {
      ...defaultData,
      ...newData,
      messages: {
        ...defaultData.messages,
        ...newData?.messages
      }
    }
  }, { immediate: true, deep: true })
  
  // 更新节点数据
  const updateNode = () => {
    emit('update', props.id, nodeData.value)
  }
  </script>