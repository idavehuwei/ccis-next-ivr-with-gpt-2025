<template>
  <div 
    class="bg-white rounded-lg border-2 border-emerald-300 min-w-[250px]" 
    :class="{ 'ring-2 ring-emerald-500': isSelected }"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-3 border-b">
      <div class="flex items-center space-x-2">
        <span class="text-gray-600">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
              stroke-width="2"/>
          </svg>
        </span>
        <span class="font-medium">{{ data.label || 'say_play_1' }}</span>
      </div>
      <button class="text-gray-400 hover:text-gray-600">
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="p-3">
      <div class="text-sm text-gray-500 text-center mb-2">(Say/Play)</div>
      <div class="text-sm">
        Say: {{ data.message || 'Welcome to the sub flow!' }}
      </div>
    </div>

    <!-- Connection Points -->
    <Handle
      type="target"
      :position="Position.Top"
      class="w-3 h-3 !bg-emerald-500"
    />
    <Handle
      type="source"
      :position="Position.Bottom"
      :id="'audio-complete'"
      class="w-3 h-3 !bg-emerald-500"
    >
      <div class="absolute top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-gray-500">
        Audio Complete
      </div>
    </Handle>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

defineProps<{
  data: {
    label?: string
    message?: string
    type?: 'say' | 'play'
  }
  isSelected?: boolean
}>()
</script>