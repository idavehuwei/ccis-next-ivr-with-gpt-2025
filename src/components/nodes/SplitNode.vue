<template>
  <div class="node-container p-4 bg-white rounded-lg shadow border-2" 
       :class="{ 'border-blue-500': isSelected }">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-lg font-medium">Split</h3>
      <div class="text-sm text-gray-500">
        {{ data.conditions?.length || 0 }} conditions
      </div>
    </div>
    
    <div class="text-sm text-gray-600">
      <div v-if="data.conditions?.length">
        <div v-for="(group, index) in data.conditions" :key="index" class="mb-1">
          {{ group.operator }}: {{ formatConditions(group.conditions) }}
        </div>
      </div>
      <div v-else class="italic">
        No conditions set
      </div>
    </div>

    <!-- 连接点 -->
    <Handle
      v-for="(condition, index) in data.conditions"
      :key="index"
      type="source"
      :position="Position.Right"
      :id="`condition_${index}`"
      class="w-3 h-3 bg-blue-500"
      :style="{ top: `${(index + 1) * 25}%` }"
    />
    
    <Handle
      type="target"
      :position="Position.Left"
      class="w-3 h-3 bg-blue-500"
    />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

interface Condition {
  variable: string
  operator: string
  value: string
}

interface ConditionGroup {
  operator: string
  conditions: Condition[]
}

const props = defineProps<{
  data: {
    conditions?: ConditionGroup[]
  }
  isSelected?: boolean
}>()

const formatConditions = (conditions: Condition[]) => {
  return conditions.map(c => 
    `${c.variable} ${c.operator} ${c.value}`
  ).join(' AND ')
}
</script>

<style scoped>
.node-container {
  min-width: 200px;
  min-height: 100px;
}
</style>