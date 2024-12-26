<!-- src/components/nodes/OutgoingCallNode.vue -->
<template>
    <div class="relative">
      <div class="bg-white rounded-lg min-w-[300px] border-2" 
           :class="{ 'border-green-500 ring-2 ring-green-500': isSelected, 'border-gray-200': !isSelected }">
        <!-- Header -->
        <div class="bg-green-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                    stroke-width="2"/>
            </svg>
            <span class="font-medium text-base">Make Outgoing Call</span>
            <button class="w-5 h-5 text-white/80 hover:text-white">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div class="flex items-center space-x-2">
            <span v-if="data.error" class="text-red-100">!</span>
            <button class="text-white/80 hover:text-white">
              <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          </div>
        </div>
  
        <!-- Content -->
        <div class="p-4">
          <div class="space-y-4">
            <!-- Phone Number Input -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">CALL TO</label>
              <div class="flex space-x-2">
                <input 
                  type="text"
                  v-model="data.address"
                  placeholder="{{contact.channel.address}}"
                  class="flex-1 px-3 py-2 border rounded text-sm font-mono bg-gray-50"
                  readonly
                />
                <button 
                  class="p-2 text-gray-400 hover:text-gray-600 border rounded"
                  title="Edit Address"
                >
                  <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                  </svg>
                </button>
              </div>
            </div>
  
            <!-- Call Settings -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">TIMEOUT (SEC)</label>
                <input 
                  type="number"
                  v-model="data.timeout"
                  class="w-full px-3 py-2 border rounded text-sm"
                  min="5"
                  max="300"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">CALLER ID</label>
                <input 
                  type="tel"
                  v-model="data.callerId"
                  class="w-full px-3 py-2 border rounded text-sm"
                  placeholder="+1234567890"
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
        class="w-3 h-3 !bg-green-500"
      />
      
      <!-- Output Handles -->
      <div class="flex justify-around mt-3">
        <div v-for="output in outputs" :key="output.id" class="flex flex-col items-center">
          <Handle
            type="source"
            :position="Position.Bottom"
            :id="output.id"
            class="w-3 h-3 !bg-green-500 cursor-pointer hover:scale-110 transition-transform"
          />
          <span 
            class="mt-1 text-xs text-gray-500 px-2 py-1 rounded"
            :class="output.class"
          >
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
      address?: string
      timeout?: number
      callerId?: string
      error?: boolean
    }
    isSelected?: boolean
  }>()
  
  const outputs = [
    { id: 'answered', label: 'Answered', class: 'bg-green-100 text-green-700' },
    { id: 'busy', label: 'Busy', class: 'bg-yellow-100 text-yellow-700' },
    { id: 'no-answer', label: 'No Answer', class: 'bg-orange-100 text-orange-700' },
    { id: 'failed', label: 'Call Failed', class: 'bg-red-100 text-red-700' }
  ]
  
  const emit = defineEmits<{
    (e: 'update', id: string, data: any): void
  }>()
  </script>
  
  <style scoped>
  .font-mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
  </style>