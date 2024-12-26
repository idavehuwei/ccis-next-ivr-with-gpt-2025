<template>
    <div class="relative">
      <!-- 主体框架 -->
      <div
        class="bg-white rounded-lg min-w-[300px] border border-gray-300 shadow-sm"
        :class="{ 'ring-2 ring-blue-500': isSelected }"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
          <span class="text-lg text-blue-500">📞</span>
          <span class="text-sm font-medium text-gray-700">{{ data.label || 'say_play_1' }}</span>
        </div>
  
        <!-- Content -->
        <div class="p-4">
          <div class="text-sm text-gray-500 text-center mb-2">(Say/Play)</div>
          <div class="text-sm text-gray-800">
            Say: <span class="font-medium">{{ data.message || 'Welcome to the parent flow!' }}</span>
          </div>
        </div>
      </div>
  
      <!-- 连接点 -->
      <Handle
        type="target"
        :position="Position.Top"
        class="w-3 h-3 !bg-gray-400"
      />
      <div class="flex justify-center mt-3">
        <div class="flex flex-col items-center">
          <Handle
            type="source"
            :position="Position.Bottom"
            id="audio-complete"
            class="w-3 h-3 !bg-green-500 cursor-pointer hover:scale-110 transition-transform"
          />
          <span class="mt-1 text-xs text-green-600">Audio Complete</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Position, Handle } from '@vue-flow/core'
  
  // 定义 Props
  defineProps<{
    data: {
      label?: string
      message?: string
    }
    isSelected?: boolean
  }>()
  </script>
  
  <style scoped>
  /* 样式覆盖 */
  </style>
  