<!-- src/components/nodes/SendAndWaitNode.vue -->
<template>
    <div class="relative">
      <div class="bg-white rounded-lg min-w-[300px] border-2" 
           :class="{ 'border-blue-500 ring-2 ring-blue-500': isSelected, 'border-gray-200': !isSelected }">
        <!-- Header -->
        <div class="bg-blue-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                stroke-width="2"/>
            </svg>
            <span class="font-medium text-base">{{ data.label || 'Send & Wait' }}</span>
          </div>
        </div>
  
        <!-- Content -->
        <div class="p-4">
          <div class="space-y-4">
            <!-- Message Content -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">MESSAGE</label>
              <textarea
                v-model="nodeData.message"
                rows="3"
                class="w-full px-3 py-2 border rounded text-sm"
                placeholder="Enter your message..."
                @change="updateNode"
              ></textarea>
            </div>
  
            <!-- Wait Settings -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">TIMEOUT (SECONDS)</label>
                <input
                  type="number"
                  v-model.number="nodeData.timeout"
                  min="1"
                  max="3600"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">RETRIES</label>
                <input
                  type="number"
                  v-model.number="nodeData.retries"
                  min="0"
                  max="5"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
              </div>
            </div>
  
            <!-- Message Templates -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-xs font-medium text-gray-500">TEMPLATES</label>
                <button 
                  @click="addTemplate"
                  class="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Add Template
                </button>
              </div>
              <div class="space-y-2">
                <div v-for="(template, index) in nodeData.templates" :key="index"
                     class="flex items-center gap-2">
                  <input
                    type="text"
                    v-model="template.name"
                    placeholder="Template name"
                    class="flex-1 px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  />
                  <textarea
                    v-model="template.content"
                    placeholder="Template content"
                    rows="2"
                    class="flex-1 px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  ></textarea>
                  <button
                    @click="removeTemplate(index)"
                    class="text-red-500 hover:text-red-600"
                  >
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
  
            <!-- Response Settings -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-2">RESPONSE HANDLING</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="nodeData.saveResponse"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    @change="updateNode"
                  />
                  <span class="ml-2 text-sm text-gray-600">Save response to variable</span>
                </label>
  
                <div v-if="nodeData.saveResponse" class="flex gap-2">
                  <input
                    type="text"
                    v-model="nodeData.responseVariable"
                    placeholder="Variable name"
                    class="flex-1 px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  />
                </div>
              </div>
            </div>
  
            <!-- Validation Settings -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-2">VALIDATION</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="nodeData.enableValidation"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    @change="updateNode"
                  />
                  <span class="ml-2 text-sm text-gray-600">Enable response validation</span>
                </label>
  
                <div v-if="nodeData.enableValidation" class="space-y-2">
                  <select
                    v-model="nodeData.validationType"
                    class="w-full px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  >
                    <option value="any">Any Response</option>
                    <option value="text">Text Match</option>
                    <option value="regex">Regular Expression</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                  </select>
  
                  <div v-if="['text', 'regex'].includes(nodeData.validationType)">
                    <input
                      type="text"
                      v-model="nodeData.validationPattern"
                      :placeholder="nodeData.validationType === 'text' ? 'Text to match' : 'Regular expression'"
                      class="w-full px-3 py-2 border rounded text-sm"
                      @change="updateNode"
                    />
                  </div>
  
                  <input
                    type="text"
                    v-model="nodeData.invalidMessage"
                    placeholder="Invalid response message"
                    class="w-full px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  />
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
        class="w-3 h-3 !bg-blue-500"
      />
      
      <!-- Output Handles -->
      <div class="flex justify-around mt-3">
        <div v-for="output in getOutputs()" :key="output.id" 
             class="flex flex-col items-center">
          <Handle
            type="source"
            :position="Position.Bottom"
            :id="output.id"
            class="w-3 h-3 !bg-blue-500 cursor-pointer hover:scale-110 transition-transform"
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
  import { ref, watch, computed } from 'vue'
  import { Handle, Position } from '@vue-flow/core'
  
  interface Template {
    name: string
    content: string
  }
  
  interface SendWaitData {
    label?: string
    message?: string
    timeout?: number
    retries?: number
    templates?: Template[]
    saveResponse?: boolean
    responseVariable?: string
    enableValidation?: boolean
    validationType?: 'any' | 'text' | 'regex' | 'number' | 'date'
    validationPattern?: string
    invalidMessage?: string
  }
  
  const props = defineProps<{
    id: string
    data: SendWaitData
    isSelected?: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update', id: string, data: SendWaitData): void
  }>()
  
  // 默认值
  const defaultData: SendWaitData = {
    label: 'Send & Wait',
    message: '',
    timeout: 60,
    retries: 3,
    templates: [],
    saveResponse: false,
    responseVariable: 'response',
    enableValidation: false,
    validationType: 'any',
    validationPattern: '',
    invalidMessage: 'Invalid response. Please try again.'
  }
  
  // 基础输出连接点
  const baseOutputs = [
    { 
      id: 'reply', 
      label: 'Got Reply',
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
    }
  ]
  
  // 使用ref来存储节点数据
  const nodeData = ref<SendWaitData>({...defaultData})
  
  // 监听props.data的变化
  watch(() => props.data, (newData) => {
    nodeData.value = {
      ...defaultData,
      ...newData,
      templates: newData?.templates || []
    }
  }, { immediate: true, deep: true })
  
  // 获取动态输出连接点
  const getOutputs = () => {
    const outputs = [...baseOutputs]
    
    // 如果启用了验证,添加验证失败输出
    if (nodeData.value.enableValidation) {
      outputs.push({
        id: 'invalid',
        label: 'Invalid',
        class: 'bg-purple-100 text-purple-700'
      })
    }
    
    return outputs
  }
  
  // 模板管理
  const addTemplate = () => {
    nodeData.value.templates?.push({
      name: '',
      content: ''
    })
    updateNode()
  }
  
  const removeTemplate = (index: number) => {
    nodeData.value.templates?.splice(index, 1)
    updateNode()
  }
  
  // 更新节点数据
  const updateNode = () => {
    emit('update', props.id, nodeData.value)
  }
  </script>