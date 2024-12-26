<!-- src/components/nodes/SplitNode.vue -->
<template>
    <div class="relative">
      <div class="bg-white rounded-lg min-w-[300px] border-2" 
           :class="{ 'border-blue-500 ring-2 ring-blue-500': isSelected, 'border-gray-200': !isSelected }">
        <!-- Header -->
        <div class="bg-blue-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <span class="font-medium text-base">Split Based On...</span>
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
            <!-- Split Type -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">SPLIT TYPE</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="type in splitTypes"
                  :key="type.value"
                  class="px-3 py-1.5 rounded text-sm"
                  :class="[
                    data.splitType === type.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  ]"
                  @click="updateSplitType(type.value)"
                >
                  {{ type.label }}
                </button>
              </div>
            </div>
  
            <!-- Dynamic Content Based on Split Type -->
            <div v-if="data.splitType">
              <!-- Variable Split -->
              <template v-if="data.splitType === 'variable'">
                <div class="space-y-2">
                  <label class="block text-xs font-medium text-gray-500">VARIABLE NAME</label>
                  <input 
                    type="text"
                    v-model="data.variableName"
                    class="w-full px-3 py-2 border rounded text-sm"
                    placeholder="flow.customer_type"
                  />
                </div>
              </template>
  
              <!-- Time Split -->
              <template v-if="data.splitType === 'time'">
                <div class="space-y-2">
                  <label class="block text-xs font-medium text-gray-500">TIMEZONE</label>
                  <select
                    v-model="data.timezone"
                    class="w-full px-3 py-2 border rounded text-sm"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </template>
  
              <!-- Random Split -->
              <template v-if="data.splitType === 'random'">
                <div class="text-sm text-gray-500">
                  Traffic will be randomly distributed across all branches.
                </div>
              </template>
  
              <!-- Conditions List -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label class="block text-xs font-medium text-gray-500">CONDITIONS</label>
                  <button 
                    class="text-blue-600 hover:text-blue-700 text-sm"
                    @click="addCondition"
                  >
                    Add Condition
                  </button>
                </div>
                <div class="space-y-2">
                  <div 
                    v-for="(condition, index) in data.conditions" 
                    :key="index"
                    class="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      v-model="condition.value"
                      class="flex-1 px-3 py-2 border rounded text-sm"
                      :placeholder="getConditionPlaceholder(data.splitType)"
                    />
                    <button
                      class="p-2 text-red-500 hover:text-red-700"
                      @click="removeCondition(index)"
                    >
                      <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
          v-for="(condition, index) in data.conditions"
          :key="index"
          class="flex flex-col items-center"
        >
          <Handle
            type="source"
            :position="Position.Bottom"
            :id="`condition-${index}`"
            class="w-3 h-3 !bg-blue-500 cursor-pointer hover:scale-110 transition-transform"
          />
          <span class="mt-1 text-xs text-gray-500">{{ condition.value || `Branch ${index + 1}` }}</span>
        </div>
        <div class="flex flex-col items-center">
          <Handle
            type="source"
            :position="Position.Bottom"
            id="default"
            class="w-3 h-3 !bg-blue-500 cursor-pointer hover:scale-110 transition-transform"
          />
          <span class="mt-1 text-xs text-gray-500">Default</span>
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
      splitType?: string
      variableName?: string
      timezone?: string
      conditions: Array<{
        value: string
        target?: string
      }>
    }
    isSelected?: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update', id: string, data: any): void
  }>()
  
  const splitTypes = [
    { value: 'variable', label: 'Variable' },
    { value: 'time', label: 'Time of Day' },
    { value: 'random', label: 'Random' }
  ]
  
  const updateSplitType = (type: string) => {
    emit('update', props.id, {
      ...props.data,
      splitType: type
    })
  }
  
  const addCondition = () => {
    const conditions = [...(props.data.conditions || [])]
    conditions.push({ value: '' })
    emit('update', props.id, {
      ...props.data,
      conditions
    })
  }
  
  const removeCondition = (index: number) => {
    const conditions = [...props.data.conditions]
    conditions.splice(index, 1)
    emit('update', props.id, {
      ...props.data,
      conditions
    })
  }
  
  const getConditionPlaceholder = (type: string) => {
    switch (type) {
      case 'variable':
        return 'value == "premium"'
      case 'time':
        return '9:00-17:00'
      case 'random':
        return '50%'
      default:
        return 'Enter condition'
    }
  }
  </script>