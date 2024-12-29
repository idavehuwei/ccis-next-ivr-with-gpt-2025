<template>
    <div class="event-handler">
      <!-- 事件类型选择 -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
        <select
          v-model="localValue.type"
          class="w-full px-3 py-2 border rounded-md"
          @change="updateValue"
        >
          <option value="message">Message</option>
          <option value="status">Status Change</option>
          <option value="error">Error</option>
          <option value="custom">Custom Event</option>
        </select>
      </div>
  
      <!-- 条件配置 -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700">Conditions</label>
          <button
            type="button"
            @click="addCondition"
            class="text-sm text-blue-600 hover:text-blue-700"
          >
            Add Condition
          </button>
        </div>
        
        <div class="space-y-2">
          <div v-for="(condition, index) in localValue.conditions" 
               :key="index"
               class="flex items-center space-x-2"
          >
            <select
              v-model="condition.field"
              class="flex-1 px-3 py-2 border rounded-md"
              @change="updateValue"
            >
              <option v-for="field in availableFields" 
                      :key="field.value" 
                      :value="field.value"
              >
                {{ field.label }}
              </option>
            </select>
            
            <select
              v-model="condition.operator"
              class="w-32 px-3 py-2 border rounded-md"
              @change="updateValue"
            >
              <option value="equals">equals</option>
              <option value="contains">contains</option>
              <option value="starts_with">starts with</option>
              <option value="ends_with">ends with</option>
              <option value="regex">matches regex</option>
            </select>
            
            <input
              v-model="condition.value"
              type="text"
              class="flex-1 px-3 py-2 border rounded-md"
              placeholder="Value"
              @change="updateValue"
            />
            
            <button
              type="button"
              @click="removeCondition(index)"
              class="text-red-500 hover:text-red-700"
            >
              <span class="sr-only">Remove</span>
              ×
            </button>
          </div>
        </div>
      </div>
  
      <!-- 动作配置 -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700">Actions</label>
          <button
            type="button"
            @click="addAction"
            class="text-sm text-blue-600 hover:text-blue-700"
          >
            Add Action
          </button>
        </div>
        
        <div class="space-y-2">
          <div v-for="(action, index) in localValue.actions" 
               :key="index"
               class="space-y-2 p-2 border rounded-md"
          >
            <select
              v-model="action.type"
              class="w-full px-3 py-2 border rounded-md"
              @change="updateValue"
            >
              <option value="set_variable">Set Variable</option>
              <option value="send_message">Send Message</option>
              <option value="http_request">Make HTTP Request</option>
              <option value="execute_function">Execute Function</option>
            </select>
            
            <!-- 动作特定配置 -->
            <div class="pl-4">
              <template v-if="action.type === 'set_variable'">
                <div class="grid grid-cols-2 gap-2">
                  <input
                    v-model="action.variable"
                    type="text"
                    class="px-3 py-2 border rounded-md"
                    placeholder="Variable name"
                    @change="updateValue"
                  />
                  <input
                    v-model="action.value"
                    type="text"
                    class="px-3 py-2 border rounded-md"
                    placeholder="Value"
                    @change="updateValue"
                  />
                </div>
              </template>
              
              <template v-if="action.type === 'send_message'">
                <textarea
                  v-model="action.message"
                  rows="2"
                  class="w-full px-3 py-2 border rounded-md"
                  placeholder="Message content"
                  @change="updateValue"
                ></textarea>
              </template>
              
              <template v-if="action.type === 'http_request'">
                <input
                  v-model="action.url"
                  type="text"
                  class="w-full px-3 py-2 border rounded-md mb-2"
                  placeholder="URL"
                  @change="updateValue"
                />
                <select
                  v-model="action.method"
                  class="w-full px-3 py-2 border rounded-md"
                  @change="updateValue"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                </select>
              </template>
            </div>
            
            <button
              type="button"
              @click="removeAction(index)"
              class="text-red-500 hover:text-red-700"
            >
              Remove Action
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const props = defineProps<{
    modelValue: {
      type: string
      conditions: Array<{
        field: string
        operator: string
        value: string
      }>
      actions: Array<{
        type: string
        [key: string]: any
      }>
    }
  }>()
  
  const emit = defineEmits(['update:modelValue'])
  
  // 本地数据
  const localValue = ref({ ...props.modelValue })
  
  // 可用字段配置
  const availableFields = [
    { value: 'message.body', label: 'Message Body' },
    { value: 'message.type', label: 'Message Type' },
    { value: 'message.from', label: 'Sender' },
    { value: 'status.code', label: 'Status Code' },
    { value: 'error.message', label: 'Error Message' }
  ]
  
  // 条件管理
  const addCondition = () => {
    localValue.value.conditions.push({
      field: '',
      operator: 'equals',
      value: ''
    })
    updateValue()
  }
  
// 继续 script setup 部分:

const removeCondition = (index: number) => {
  localValue.value.conditions.splice(index, 1)
  updateValue()
}

// 动作管理
const addAction = () => {
  localValue.value.actions.push({
    type: 'set_variable',
    variable: '',
    value: ''
  })
  updateValue()
}

const removeAction = (index: number) => {
  localValue.value.actions.splice(index, 1)
  updateValue()
}

// 检查条件配置是否有效
const isValidCondition = (condition: any) => {
  return condition.field && condition.operator && condition.value !== undefined
}

// 检查动作配置是否有效
const isValidAction = (action: any) => {
  switch (action.type) {
    case 'set_variable':
      return action.variable && action.value !== undefined
    case 'send_message':
      return action.message
    case 'http_request':
      return action.url && action.method
    case 'execute_function':
      return action.functionName
    default:
      return false
  }
}

// 更新值
const updateValue = () => {
  // 过滤掉无效的条件和动作
  const validConditions = localValue.value.conditions.filter(isValidCondition)
  const validActions = localValue.value.actions.filter(isValidAction)

  emit('update:modelValue', {
    ...localValue.value,
    conditions: validConditions,
    actions: validActions
  })
}

// 监听 props 变化
watch(() => props.modelValue, (newValue) => {
  localValue.value = { ...newValue }
}, { deep: true })

// 导出类型定义
interface Condition {
  field: string
  operator: string
  value: string
}

interface Action {
  type: string
  [key: string]: any
}

interface EventHandlerData {
  type: string
  conditions: Condition[]
  actions: Action[]
}
</script>

<style scoped>
.event-handler {
  position: relative;
}

/* 添加动画效果 */
.event-handler .space-y-2 > * {
  transition: all 0.3s ease-in-out;
}

/* 条件和动作的悬停效果 */
.event-handler .rounded-md:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 删除按钮的过渡效果 */
.event-handler button {
  transition: opacity 0.2s ease-in-out;
}

.event-handler button:hover {
  opacity: 0.8;
}
</style>