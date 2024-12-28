<!-- src/components/nodes/TriggerNode.vue -->
<template>
  <div class="relative">
    <div class="bg-white rounded-lg min-w-[300px] shadow-sm" 
         :class="{ 'ring-2 ring-blue-500': isSelected }">
      <!-- Header -->
      <div class="bg-red-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" 
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="font-medium text-base">{{ nodeData.label || 'Trigger' }}</span>
          <button class="w-5 h-5 text-white/80 hover:text-white">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4">
        <div class="flex flex-col gap-4">
          <!-- Trigger Type Selection -->
          <div>
            <div class="text-sm font-medium text-gray-700 mb-2">TRIGGER TYPE</div>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="type in triggerTypes"
                :key="type.value"
                class="flex items-center gap-2 p-3 rounded text-sm transition-colors border"
                :class="[
                  nodeData.triggerType === type.value 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'text-gray-700 border-gray-200 hover:bg-gray-50'
                ]"
                @click="selectTriggerType(type.value)"
              >
                <component :is="type.icon" class="w-5 h-5" />
                <span>{{ type.label }}</span>
              </button>
            </div>
          </div>

          <!-- Trigger Conditions -->
          <div v-if="nodeData.triggerType === 'conditional'">
            <div class="text-sm font-medium text-gray-700 mb-2">CONDITIONS</div>
            <div class="space-y-2">
              <div v-for="(condition, index) in nodeData.conditions" :key="index"
                   class="flex gap-2 items-start">
                <select 
                  v-model="condition.variable"
                  class="flex-1 px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                >
                  <option value="">Select variable...</option>
                  <option v-for="variable in availableVariables" 
                          :key="variable"
                          :value="variable">
                    {{ variable }}
                  </option>
                </select>
                <select 
                  v-model="condition.operator"
                  class="w-32 px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                >
                  <option value="equals">equals</option>
                  <option value="contains">contains</option>
                  <option value="starts_with">starts with</option>
                  <option value="greater_than">greater than</option>
                  <option value="less_than">less than</option>
                </select>
                <input 
                  type="text"
                  v-model="condition.value"
                  placeholder="Value"
                  class="flex-1 px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
                <button 
                  @click="removeCondition(index)"
                  class="p-2 text-red-500 hover:text-red-600"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
              <button
                @click="addCondition"
                class="text-red-600 hover:text-red-700 text-sm"
              >
                + Add Condition
              </button>
            </div>
          </div>

          <!-- Subflow Selection -->
          <div v-if="nodeData.triggerType === 'subflow'">
            <div class="text-sm font-medium text-gray-700 mb-2">SELECT SUBFLOW</div>
            <select
              v-model="nodeData.subflowId"
              class="w-full px-3 py-2 border rounded text-sm"
              @change="updateNode"
            >
              <option value="">Select a subflow...</option>
              <option v-for="flow in availableFlows" 
                      :key="flow.id" 
                      :value="flow.id">
                {{ flow.name }}
              </option>
            </select>
          </div>

          <!-- API Configuration -->
          <div v-if="nodeData.triggerType === 'api'">
            <div class="text-sm font-medium text-gray-700 mb-2">API ENDPOINT</div>
            <div class="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {{ apiEndpoint }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Connection Points -->
    <div class="flex justify-around mt-3">
      <div v-for="output in getOutputs()" 
           :key="output.id"
           class="flex flex-col items-center">
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
import { computed, ref, watch } from 'vue'
import { Position, Handle } from '@vue-flow/core'

const props = defineProps<{
  id: string
  data?: any
  isSelected?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', id: string, data: any): void
}>()

// 默认值
const defaultData = {
  label: 'Trigger',
  triggerType: 'incoming_call',
  conditions: [],
  subflowId: '',
  webhookUrl: '',
}

// 使用ref存储节点数据
const nodeData = ref({...defaultData})

// 监听props.data变化
watch(() => props.data, (newData) => {
  nodeData.value = {
    ...defaultData,
    ...newData
  }
}, { immediate: true, deep: true })

// 触发类型定义
const triggerTypes = [
  { 
    value: 'incoming_call',
    label: 'Incoming Call',
    icon: 'PhoneIcon'
  },
  { 
    value: 'incoming_message',
    label: 'Incoming Message',
    icon: 'ChatIcon'
  },
  { 
    value: 'api',
    label: 'API Trigger',
    icon: 'CodeIcon'
  },
  { 
    value: 'conditional',
    label: 'Conditional',
    icon: 'SwitchIcon'
  },
  { 
    value: 'subflow',
    label: 'Subflow',
    icon: 'ArrowsExpandIcon'
  }
]

// 模拟数据
const availableVariables = [
  'flow.customer_type',
  'flow.language',
  'contact.phone_number',
  'contact.name'
]

const availableFlows = [
  { id: 'flow_1', name: 'Customer Support' },
  { id: 'flow_2', name: 'Sales Process' },
  { id: 'flow_3', name: 'Order Handling' }
]

// 计算API端点
const apiEndpoint = computed(() => {
  return `https://your-domain.twil.io/triggers/${props.id}`
})

// 条件管理
const addCondition = () => {
  nodeData.value.conditions.push({
    variable: '',
    operator: 'equals',
    value: ''
  })
  updateNode()
}

const removeCondition = (index: number) => {
  nodeData.value.conditions.splice(index, 1)
  updateNode()
}

// 获取输出连接点
const getOutputs = () => {
  switch (nodeData.value.triggerType) {
    case 'conditional':
      return [
        { id: 'true', label: 'True' },
        { id: 'false', label: 'False' }
      ]
    case 'subflow':
      return [
        { id: 'completed', label: 'Completed' },
        { id: 'failed', label: 'Failed' }
      ]
    default:
      return [
        { id: 'next', label: 'Next' }
      ]
  }
}

const selectTriggerType = (type: string) => {
  nodeData.value.triggerType = type
  updateNode()
}

const updateNode = () => {
  emit('update', props.id, nodeData.value)
}
</script>