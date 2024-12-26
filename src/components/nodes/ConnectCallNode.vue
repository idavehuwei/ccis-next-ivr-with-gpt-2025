<!-- src/components/nodes/ConnectCallNode.vue -->
<template>
    <div class="relative">
      <div class="bg-white rounded-lg min-w-[300px] border-2" 
           :class="{ 'border-purple-500 ring-2 ring-purple-500': isSelected, 'border-gray-200': !isSelected }">
        <!-- Header -->
        <div class="bg-purple-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <span class="font-medium text-base">Connect Call</span>
            <button class="w-5 h-5 text-white/80 hover:text-white">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <button class="text-white/80 hover:text-white">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
        </div>
  
        <!-- Content -->
        <div class="p-4">
          <div class="space-y-4">
            <!-- Phone Number Input -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">CONNECT TO</label>
              <div class="flex space-x-2">
                <input 
                  type="tel" 
                  v-model="data.phoneNumber"
                  placeholder="+1 (555) 123-4567"
                  class="flex-1 px-3 py-2 border rounded text-sm"
                />
                <button class="p-2 text-gray-400 hover:text-gray-600 border rounded">
                  <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 3a1 1 0 011-1h2a1 1 0 110 2H7a1 1 0 01-1-1zM6 13a1 1 0 011-1h2a1 1 0 110 2H7a1 1 0 01-1-1z"/>
                    <path d="M11 3a1 1 0 100 2h2a1 1 0 100-2h-2zM11 13a1 1 0 100 2h2a1 1 0 100-2h-2z"/>
                    <path d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                  </svg>
                </button>
              </div>
            </div>
  
            <!-- Settings -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">TIMEOUT</label>
                <input 
                  type="number" 
                  v-model="data.timeout"
                  class="w-full px-3 py-2 border rounded text-sm"
                  min="10"
                  max="300"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">MAX RETRIES</label>
                <input 
                  type="number" 
                  v-model="data.maxRetries"
                  class="w-full px-3 py-2 border rounded text-sm"
                  min="0"
                  max="5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Connection Points -->
      <Handle
        type="target"
        :position="Position.Top"
        class="w-3 h-3 !bg-purple-500"
      />
      <div class="flex justify-around mt-3">
        <div 
          v-for="output in outputs" 
          :key="output"
          class="flex flex-col items-center"
        >
          <Handle
            type="source"
            :position="Position.Bottom"
            :id="output.toLowerCase()"
            class="w-3 h-3 !bg-purple-500 cursor-pointer hover:scale-110 transition-transform"
          />
          <span class="mt-1 text-xs text-gray-500">{{ output }}</span>
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
      phoneNumber?: string
      timeout?: number
      maxRetries?: number
    }
    isSelected?: boolean
  }>()
  
  const outputs = ['Connected', 'Busy', 'Failed', 'No Answer']
  
  const emit = defineEmits<{
    (e: 'update', id: string, data: any): void
  }>()
  </script>