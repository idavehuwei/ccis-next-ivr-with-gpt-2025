<!-- src/components/nodes/RecordNode.vue -->
<template>
    <div class="relative">
      <div class="bg-white rounded-lg min-w-[300px] border-2" 
           :class="{ 'border-emerald-500 ring-2 ring-emerald-500': isSelected, 'border-gray-200': !isSelected }">
        <!-- Header -->
        <div class="bg-emerald-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-medium text-base">{{ data.label || 'Record Call' }}</span>
          </div>
          <button class="text-white/80 hover:text-white">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
        </div>
  
        <!-- Content Preview -->
        <div class="p-4">
          <div class="space-y-3">
            <!-- Recording Status -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Status:</span>
              <span class="text-sm font-medium" :class="{
                'text-emerald-600': data.action === 'start',
                'text-gray-600': data.action === 'stop'
              }">
                {{ data.action === 'start' ? 'Recording' : 'Stopped' }}
              </span>
            </div>
  
            <!-- Recording Settings Summary -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Channels:</span>
              <span class="text-sm font-medium text-gray-900">
                {{ data.channels === 'dual' ? 'Dual' : 'Mono' }}
              </span>
            </div>
  
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Max Duration:</span>
              <span class="text-sm font-medium text-gray-900">
                {{ data.maxLength || '∞' }} seconds
              </span>
            </div>
  
            <!-- Features -->
            <div class="flex flex-wrap gap-2 mt-2">
              <span v-if="data.trim" 
                    class="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                Trim Silence
              </span>
              <span v-if="data.playBeep" 
                    class="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                Play Beep
              </span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Connection Points -->
      <Handle
        type="target"
        :position="Position.Top"
        class="w-3 h-3 !bg-emerald-500"
      />
      
      <div class="flex justify-around mt-3">
        <div v-for="output in outputs" :key="output.id" 
             class="flex flex-col items-center">
          <Handle
            type="source"
            :position="Position.Bottom"
            :id="output.id"
            class="w-3 h-3 !bg-emerald-500 cursor-pointer hover:scale-110 transition-transform"
          />
          <span class="mt-1 text-xs text-gray-500 px-2 py-0.5 rounded"
                :class="output.class">
            {{ output.label }}
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Handle, Position } from '@vue-flow/core'
  
  const props = defineProps<{
    id: string
    data: {
      label?: string
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
  
  // Output connection points configuration
  const outputs = [
    { 
      id: 'success', 
      label: 'Success',
      class: 'bg-green-100 text-green-700'
    },
    { 
      id: 'no-input', 
      label: 'No Input',
      class: 'bg-yellow-100 text-yellow-700'
    },
    { 
      id: 'max-length', 
      label: 'Max Length',
      class: 'bg-orange-100 text-orange-700'
    },
    { 
      id: 'error', 
      label: 'Error',
      class: 'bg-red-100 text-red-700'
    }
  ]
  </script>