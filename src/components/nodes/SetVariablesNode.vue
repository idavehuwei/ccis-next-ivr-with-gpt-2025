<!-- src/components/nodes/SetVariablesNode.vue -->
<template>
  <div 
    class="bg-white rounded-lg border-2 border-blue-300 min-w-[300px]" 
    :class="{ 'ring-2 ring-blue-500': isSelected }"
  >
    <!-- Header -->
    <div class="bg-blue-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="font-medium text-base">{{ data.label || 'Set Variables' }}</span>
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

    <!-- Content -->
    <div class="p-4">
      <div class="text-sm text-gray-500 text-center mb-4">
        (Set Variables)
      </div>

      <!-- Variables List -->
      <div class="space-y-3">
        <div v-for="(value, key) in data.variables" :key="key" 
             class="flex items-center justify-between bg-gray-50 p-2 rounded">
          <div class="flex-1 grid grid-cols-2 gap-2">
            <div class="text-sm font-medium text-gray-700">{{ key }}</div>
            <div class="text-sm text-gray-600 truncate">{{ value }}</div>
          </div>
          <div class="flex items-center space-x-2">
            <button 
              class="text-blue-600 hover:text-blue-700"
              @click="editVariable(key)"
            >
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
              </svg>
            </button>
            <button 
              class="text-red-600 hover:text-red-700"
              @click="removeVariable(key)"
            >
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Add Variable Button -->
        <button 
          class="w-full py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded hover:bg-blue-50"
          @click="addVariable"
        >
          + Add Variable
        </button>
      </div>

      <!-- Variable Preview -->
      <div v-if="Object.keys(data.variables || {}).length > 0" class="mt-4">
        <div class="text-xs font-medium text-gray-500 mb-2">PREVIEW</div>
        <div class="bg-gray-900 rounded p-3 font-mono text-sm">
          <pre class="text-green-400">{{ JSON.stringify(data.variables, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- Connection Points -->
    <Handle
      type="target"
      :position="Position.Top"
      class="w-3 h-3 !bg-blue-500"
    />
    <Handle
      type="source"
      :position="Position.Bottom"
      id="next"
      class="w-3 h-3 !bg-blue-500"
    >
      <div class="absolute top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-gray-500">
        Next
      </div>
    </Handle>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { ref } from 'vue'

const props = defineProps<{
  id: string
  data: {
    label?: string
    variables?: Record<string, string>
  }
  isSelected?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', id: string, data: any): void
}>()

const addVariable = () => {
  const variables = { ...(props.data.variables || {}) }
  const newKey = `variable_${Object.keys(variables).length + 1}`
  variables[newKey] = ''
  
  emit('update', props.id, {
    ...props.data,
    variables
  })
}

const removeVariable = (key: string) => {
  const variables = { ...(props.data.variables || {}) }
  delete variables[key]
  
  emit('update', props.id, {
    ...props.data,
    variables
  })
}

const editVariable = (key: string) => {
  // TODO: 实现编辑变量的功能
  // 这里可以打开一个对话框来编辑变量
  console.log('Edit variable:', key)
}
</script>

<style scoped>
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>