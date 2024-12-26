<template>
    <div class="bg-white border-l w-80 flex flex-col h-full">
      <!-- Panel Header -->
      <div class="p-4 border-b">
        <div class="flex items-center justify-between">
          <h2 class="font-medium text-gray-900">Variables Config</h2>
          <button
            @click="$emit('hide')"
            class="text-blue-600 hover:text-blue-700 text-sm"
          >
            Hide
          </button>
        </div>
      </div>
  
      <!-- Variables Configuration -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-4">
          <div class="flex items-center mb-3">
            <svg
              class="w-4 h-4 text-gray-400 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke-width="2"
              />
            </svg>
            <span class="text-sm font-medium text-gray-700">VARIABLES</span>
          </div>
  
          <div class="space-y-4">
            <!-- Variable Items -->
            <div
              v-for="(variable, index) in variables"
              :key="index"
              class="p-3 border rounded-lg flex items-center justify-between"
            >
              <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center mr-3 font-bold">
                  {{ variable.icon }}
                </div>
                <input
                  type="text"
                  v-model="variable.name"
                  placeholder="Variable Name"
                  class="text-gray-700 border rounded px-2 py-1 text-sm"
                />
              </div>
              <button
                @click="removeVariable(index)"
                class="text-red-500 hover:text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
  
          <button
            @click="addVariable"
            class="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Add Variable
          </button>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { reactive } from 'vue'

// Emit event to hide the widget
const emit = defineEmits<{
  (e: 'hide'): void
}>()

// Reactive variables list
const variables = reactive([
  { name: 'Variable 1', icon: 'V' },
  { name: 'Variable 2', icon: 'V' }
])

// Add a new variable
const addVariable = () => {
  variables.push({
    name: `Variable ${variables.length + 1}`,
    icon: 'V'
  })
}

// Remove a variable by index
const removeVariable = (index: number) => {
  variables.splice(index, 1)
}
</script>


<style scoped>
/* Optional styling */
</style>
