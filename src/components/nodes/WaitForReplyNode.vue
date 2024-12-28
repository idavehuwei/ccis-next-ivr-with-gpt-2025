<!-- src/components/nodes/WaitForReplyNode.vue -->
<template>
    <div class="relative">
      <div class="bg-white rounded-lg min-w-[300px] border-2" 
           :class="{ 'border-indigo-500 ring-2 ring-indigo-500': isSelected, 'border-gray-200': !isSelected }">
        <!-- Header -->
        <div class="bg-indigo-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-medium text-base">{{ nodeData.label || 'Wait For Reply' }}</span>
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
            <!-- Timeout Settings -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">TIMEOUT</label>
              <div class="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  v-model.number="nodeData.timeout"
                  min="1"
                  max="1440"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
                <select
                  v-model="nodeData.timeoutUnit"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
            </div>
  
            <!-- Reply Validation -->
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="nodeData.enableValidation"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  @change="updateNode"
                />
                <span class="ml-2 text-sm text-gray-600">Enable Reply Validation</span>
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
                  <option value="keywords">Keywords</option>
                </select>
  
                <div v-if="['text', 'regex', 'keywords'].includes(nodeData.validationType)">
                  <input
                    type="text"
                    v-model="nodeData.validationValue"
                    :placeholder="getValidationPlaceholder"
                    class="w-full px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  />
                </div>
  
                <div v-if="nodeData.validationType === 'number'" class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">MIN</label>
                    <input
                      type="number"
                      v-model.number="nodeData.validationMin"
                      class="w-full px-3 py-2 border rounded text-sm"
                      @change="updateNode"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">MAX</label>
                    <input
                      type="number"
                      v-model.number="nodeData.validationMax"
                      class="w-full px-3 py-2 border rounded text-sm"
                      @change="updateNode"
                    />
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Save Reply -->
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="nodeData.saveReply"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  @change="updateNode"
                />
                <span class="ml-2 text-sm text-gray-600">Save Reply to Variable</span>
              </label>
  
              <div v-if="nodeData.saveReply">
                <input
                  type="text"
                  v-model="nodeData.replyVariable"
                  placeholder="Variable name"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
              </div>
            </div>
  
            <!-- Custom Messages -->
            <div class="space-y-2">
              <label class="block text-xs font-medium text-gray-500">MESSAGES</label>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Invalid Response</label>
                <input
                  type="text"
                  v-model="nodeData.messages.invalid"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Timeout</label>
                <input
                  type="text"
                  v-model="nodeData.messages.timeout"
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
        class="w-3 h-3 !bg-indigo-500"
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
            class="w-3 h-3 !bg-indigo-500 cursor-pointer hover:scale-110 transition-transform"
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
  import { ref, watch, computed } from 'vue'
  import { Handle, Position } from '@vue-flow/core'
  
  const props = defineProps<{
    id: string
    data: {
      label?: string
      timeout?: number
      timeoutUnit?: 'seconds' | 'minutes' | 'hours'
      enableValidation?: boolean
      validationType?: 'any' | 'text' | 'regex' | 'number' | 'keywords'
      validationValue?: string
      validationMin?: number
      validationMax?: number
      saveReply?: boolean
      replyVariable?: string
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
  
  // Default data
  const defaultData = {
    label: 'Wait For Reply',
    timeout: 5,
    timeoutUnit: 'minutes',
    enableValidation: false,
    validationType: 'any',
    validationValue: '',
    validationMin: 0,
    validationMax: 100,
    saveReply: false,
    replyVariable: 'reply',
    messages: {
      invalid: 'Invalid response. Please try again.',
      timeout: 'No response received. Please try again.'
    }
  }
  
  // Node data
  const nodeData = ref({...defaultData})
  
  // Watch for data changes
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
  
  // Computed placeholder based on validation type
  const getValidationPlaceholder = computed(() => {
    switch (nodeData.value.validationType) {
      case 'text':
        return 'Enter text to match'
      case 'regex':
        return 'Enter regular expression'
      case 'keywords':
        return 'Enter keywords (comma separated)'
      default:
        return ''
    }
  })
  
  // Output connection points
  const outputs = [
    { 
      id: 'replied', 
      label: 'Got Reply',
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
    }
  ]
  
  // Update node data
  const updateNode = () => {
    emit('update', props.id, nodeData.value)
  }
  </script>