<!-- src/components/nodes/SendAndReplyNode.vue -->
<template>
  <div class="relative">
    <div class="bg-white rounded-lg min-w-[300px] border-2 border-blue-500" 
         :class="{ 'ring-2 ring-blue-500': isSelected }">
      <!-- Header -->
      <div class="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="text-xl">💬</span>
          <span class="text-sm font-medium text-gray-700">{{ data.label || 'send_and_reply_1' }}</span>
        </div>
        <div class="flex items-center gap-3">
          <button class="text-yellow-500 hover:text-yellow-600">⚠️</button>
          <button class="text-gray-400 hover:text-gray-600">✕</button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4">
        <div class="text-sm text-gray-500 text-center mb-4">
          (Send & Wait For Reply)
        </div>
        <div class="flex justify-around gap-2">
          <button
            v-for="option in replyOptions"
            :key="option"
            class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>

    <!-- Connection Points -->
    <Handle
      type="target"
      :position="Position.Top"
      class="w-3 h-3 !bg-blue-500"
    />
    <div class="flex justify-around mt-3">
      <div 
        v-for="(option, index) in replyOptions" 
        :key="index"
        class="flex flex-col items-center"
      >
        <Handle
          type="source"
          :position="Position.Bottom"
          :id="'handle-' + index"
          class="w-3 h-3 !bg-blue-500 cursor-pointer hover:scale-110 transition-transform"
        />
        <span class="mt-1 text-xs text-gray-500">{{ option }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core'

defineProps<{
  data: {
    label?: string
    message?: string
  }
  isSelected?: boolean
}>()

const replyOptions = [
  'Reply',
  'No Reply',
  'Delivery Fails'
]
</script>