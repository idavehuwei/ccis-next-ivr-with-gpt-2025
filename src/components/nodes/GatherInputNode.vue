<!-- src/components/nodes/GatherInputNode.vue -->
<template>
    <div class="relative">
      <div class="bg-white rounded-lg min-w-[300px] border-2" 
           :class="{ 'border-green-500 ring-2 ring-green-500': isSelected, 'border-gray-200': !isSelected }">
        <!-- Header -->
        <div class="bg-green-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <span class="font-medium text-base">Gather Input</span>
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
          <div class="text-sm text-gray-500 mb-4">
            {{ data.promptMessage || 'Press 1 for Sales, 2 for Support...' }}
          </div>
          <div class="flex space-x-2">
            <div class="flex-1">
              <label class="block text-xs font-medium text-gray-500 mb-1">INPUT TYPE</label>
              <div class="flex space-x-2">
                <button 
                  v-for="type in inputTypes" 
                  :key="type"
                  class="px-3 py-1.5 rounded text-sm"
                  :class="[
                    data.inputType === type 
                      ? 'bg-green-500 text-white' 
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  ]"
                  @click="updateInputType(type)"
                >
                  {{ type }}
                </button>
              </div>
            </div>
            <div class="w-32">
              <label class="block text-xs font-medium text-gray-500 mb-1">TIMEOUT</label>
              <input 
                type="number" 
                v-model="data.timeout"
                class="w-full px-3 py-1.5 border rounded text-sm"
                min="1"
                max="60"
              />
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
      <div class="flex justify-around mt-3">
        <div 
          v-for="output in outputs" 
          :key="output"
          class="flex flex-col items-center"
        >
          <Handle
            type="source"
            :position="Position.Bottom"
            :id="output"
            class="w-3 h-3 !bg-green-500 cursor-pointer hover:scale-110 transition-transform"
          />
          <span class="mt-1 text-xs text-gray-500">{{ output }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Handle, Position } from '@vue-flow/core'
  
  defineProps<{
    id: string
    data: {
      label?: string
      promptMessage?: string
      inputType?: string
      timeout?: number
    }
    isSelected?: boolean
  }>()
  
  const inputTypes = ['DTMF', 'Speech', 'Both']
  const outputs = ['Input Received', 'No Input', 'Invalid']
  
  const emit = defineEmits<{
    (e: 'update', id: string, data: any): void
  }>()
  
  const updateInputType = (type: string) => {
    emit('update', props.id, {
      ...props.data,
      inputType: type
    })
  }
  </script>