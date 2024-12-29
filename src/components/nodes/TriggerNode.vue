<template>
  <div class="relative">
    <div class="bg-white rounded-lg min-w-[300px] shadow-sm" 
         :class="{ 'ring-2 ring-red-500': isSelected }">
      <!-- Header -->
      <div class="bg-red-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <span class="font-medium text-base">{{ data.label || 'Trigger' }}</span>
        </div>
      </div>

      <!-- 简化的内容展示 -->
      <div class="p-4">
        <div class="space-y-2">
          <!-- 触发类型 -->
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Type:</span>
            <span class="text-sm font-medium">{{ formatTriggerType(data.triggerType) }}</span>
          </div>
          
          <!-- 渠道信息 -->
          <div v-if="data.channel" class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Channel:</span>
            <span class="text-sm font-medium">{{ data.channel }}</span>
          </div>

          <!-- 事件数量提示 -->
          <div v-if="data.events?.length" class="text-sm text-gray-500">
            {{ data.events.length }} events configured
          </div>
        </div>
      </div>
    </div>

    <!-- Connection Points -->
    <Handle
      type="source"
      :position="Position.Bottom"
      :id="'success'"
      class="w-3 h-3 !bg-red-500"
    />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

const props = defineProps<{
  data: {
    label?: string
    triggerType?: string
    channel?: string
    events?: string[]
  }
  isSelected?: boolean
}>()

const formatTriggerType = (type?: string) => {
  if (!type) return 'Not Set'
  return type.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>