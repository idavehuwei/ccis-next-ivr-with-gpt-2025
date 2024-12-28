<!-- src/components/nodes/SetVariablesNode.vue -->
<template>
  <div class="relative">
    <div class="bg-white rounded-lg min-w-[300px] border-2 border-indigo-300" 
         :class="{ 'ring-2 ring-indigo-500': isSelected }">
      <!-- Header -->
      <div class="bg-indigo-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="font-medium text-base">{{ nodeData.label || 'Set Variables' }}</span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4">
        <div class="space-y-4">
          <!-- Variables Preview -->
          <div v-if="Object.keys(nodeData.variables || {}).length > 0">
            <div class="text-xs font-medium text-gray-500 mb-2">VARIABLES</div>
            <div class="space-y-2">
              <div v-for="(value, key) in nodeData.variables" :key="key" 
                   class="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                <div class="flex items-center space-x-2">
                  <span class="font-mono text-gray-600">{{ key }}</span>
                  <span class="text-gray-400">=</span>
                  <span class="text-gray-700">
                    {{ formatValue(value) }}
                  </span>
                </div>
                <div class="flex items-center space-x-1">
                  <span class="px-2 py-0.5 text-xs rounded"
                        :class="getTypeClass(value)">
                    {{ getValueType(value) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500 text-center">
            No variables set
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
    <Handle
      type="source"
      :position="Position.Bottom"
      id="next"
      class="w-3 h-3 !bg-indigo-500"
    >
      <div class="absolute top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-gray-500">
        Next
      </div>
    </Handle>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Handle, Position } from '@vue-flow/core'

const props = defineProps<{
  id: string
  data: {
    label?: string
    variables?: Record<string, any>
  }
  isSelected?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', id: string, data: any): void
}>()

// 默认值
const defaultData = {
  label: 'Set Variables',
  variables: {}
}

// 使用ref来存储节点数据
const nodeData = ref({...defaultData})

// 监听props.data的变化
watch(() => props.data, (newData) => {
  nodeData.value = {
    ...defaultData,
    ...newData
  }
}, { immediate: true, deep: true })

// Format value for display
const formatValue = (value: any) => {
  if (typeof value === 'string') {
    // Show template literals with special formatting
    if (value.includes('{{') && value.includes('}}')) {
      return value
    }
    return `"${value}"`
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

// Get value type
const getValueType = (value: any) => {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  return typeof value
}

// Get type style class
const getTypeClass = (value: any) => {
  const type = getValueType(value)
  switch (type) {
    case 'string':
      return 'bg-green-100 text-green-800'
    case 'number':
      return 'bg-blue-100 text-blue-800'
    case 'boolean':
      return 'bg-purple-100 text-purple-800'
    case 'object':
    case 'array':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Update node data
const updateNode = () => {
  emit('update', props.id, nodeData.value)
}
</script>