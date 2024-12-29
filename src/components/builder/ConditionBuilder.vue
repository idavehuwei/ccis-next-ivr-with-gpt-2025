<template>
  <div class="condition-builder p-4">
    <div class="mb-4">
      <h3 class="text-lg font-medium">条件构建器</h3>
      <div class="mt-2 space-y-4">
        <!-- 条件组 -->
        <div v-for="(group, groupIndex) in conditions" :key="groupIndex" class="condition-group">
          <!-- AND/OR 选择器 -->
          <select v-if="groupIndex > 0" 
                  v-model="group.operator" 
                  class="mb-2 px-3 py-1 border rounded">
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>

          <!-- 条件列表 -->
          <div class="space-y-2 pl-4">
            <div v-for="(condition, index) in group.conditions" 
                 :key="index" 
                 class="flex items-center space-x-2">
              <!-- 变量选择 -->
              <select v-model="condition.variable" 
                      class="px-3 py-1 border rounded">
                <option v-for="variable in availableVariables" 
                        :key="variable.name" 
                        :value="variable.name">
                  {{ variable.name }}
                </option>
              </select>

              <!-- 操作符选择 -->
              <select v-model="condition.operator" 
                      class="px-3 py-1 border rounded">
                <option value="equals">等于</option>
                <option value="not_equals">不等于</option>
                <option value="contains">包含</option>
                <option value="not_contains">不包含</option>
                <option value="greater_than">大于</option>
                <option value="less_than">小于</option>
              </select>

              <!-- 值输入 -->
              <input v-model="condition.value" 
                     type="text" 
                     class="px-3 py-1 border rounded"
                     placeholder="输入值">

              <!-- 删除按钮 -->
              <button @click="removeCondition(groupIndex, index)" 
                      class="text-red-500 hover:text-red-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 添加条件按钮 -->
          <button @click="addCondition(groupIndex)"
                  class="mt-2 text-blue-500 hover:text-blue-700">
            + 添加条件
          </button>
        </div>
      </div>

      <!-- 添加条件组按钮 -->
      <button @click="addConditionGroup" 
              class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        添加条件组
      </button>
    </div>

    <!-- 预览区域 -->
    <div class="mt-4">
      <h4 class="font-medium">条件预览:</h4>
      <pre class="mt-2 p-2 bg-gray-100 rounded">{{ conditionPreview }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Condition {
  variable: string
  operator: string
  value: string
}

interface ConditionGroup {
  operator: 'AND' | 'OR'
  conditions: Condition[]
}

const props = defineProps<{
  availableVariables: Array<{
    name: string
    type: string
    description?: string
  }>
}>()

const emit = defineEmits(['update:conditions'])

const conditions = ref<ConditionGroup[]>([
  {
    operator: 'AND',
    conditions: []
  }
])

// 添加条件组
const addConditionGroup = () => {
  conditions.value.push({
    operator: 'AND',
    conditions: []
  })
}

// 添加条件
const addCondition = (groupIndex: number) => {
  conditions.value[groupIndex].conditions.push({
    variable: '',
    operator: 'equals',
    value: ''
  })
}

// 删除条件
const removeCondition = (groupIndex: number, conditionIndex: number) => {
  conditions.value[groupIndex].conditions.splice(conditionIndex, 1)
  if (conditions.value[groupIndex].conditions.length === 0 && conditions.value.length > 1) {
    conditions.value.splice(groupIndex, 1)
  }
}

// 条件预览
const conditionPreview = computed(() => {
  return JSON.stringify(conditions.value, null, 2)
})

// 监听条件变化并触发更新
watch(conditions, (newValue) => {
  emit('update:conditions', newValue)
}, { deep: true })
</script> 