<!-- src/components/nodes/CallRecordingNode.vue -->
<template>
    <div 
      class="bg-white rounded-lg shadow-sm min-w-[240px]" 
      :class="{ 'ring-2 ring-green-500': isSelected }"
    >
      <!-- Content -->
      <div class="p-4">
        <!-- Icon and Title -->
        <div class="flex items-center gap-2 mb-2">
          <div class="w-4 h-4 rounded-full bg-gray-400"></div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" 
                stroke-width="2"/>
            </svg>
            <span class="text-gray-700">recordCall</span>
          </div>
        </div>
  
        <!-- Subtitle -->
        <div class="text-gray-500 text-sm mb-3">(Call Recording)</div>
  
        <!-- Recording Status -->
        <div class="text-gray-700">
          Recording: {{ data.action === 'start' ? 'On' : 'Off' }}
        </div>
      </div>
  
      <!-- Connection Points -->
      <Handle
        type="target"
        :position="Position.Top"
        class="w-3 h-3 !bg-green-500"
      />
      
      <div class="flex justify-start gap-16 mt-3 ml-4">
        <div class="flex flex-col items-center">
          <Handle
            type="source"
            :position="Position.Bottom"
            id="success"
            class="w-3 h-3 !bg-green-500"
          />
          <span class="mt-1 text-xs text-gray-600 bg-green-100 px-3 py-1 rounded">Success</span>
        </div>
        <div class="flex flex-col items-center">
          <Handle
            type="source"
            :position="Position.Bottom"
            id="failed"
            class="w-3 h-3 !bg-green-500"
          />
          <span class="mt-1 text-xs text-gray-600 bg-green-100 px-3 py-1 rounded">Failed</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Handle, Position } from '@vue-flow/core'
  
  const props = defineProps<{
    id: string
    data: {
      action: 'start' | 'stop'
      channels?: 'mono' | 'dual'
      trim?: boolean
      playBeep?: boolean
      statusCallback?: string
      maxLength?: number
    }
    isSelected?: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update', id: string, data: any): void
  }>()
  </script>
  
  <style scoped>
  .vue-flow__handle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #22c55e;
  }
  
  .vue-flow__handle-bottom {
    bottom: -6px;
  }
  
  .vue-flow__handle-top {
    top: -6px;
  }
  </style>