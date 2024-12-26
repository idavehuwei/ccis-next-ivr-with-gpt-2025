<!-- src/components/nodes/TriggerNode.vue -->
<template>
  <div class="relative">
    <div class="bg-white rounded-lg min-w-[300px] shadow-sm" 
         :class="{ 'ring-2 ring-blue-500': isSelected }">
      <!-- Header -->
      <div class="bg-red-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <span class="font-medium text-base">Trigger</span>
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

      <!-- Trigger Options -->
      <div class="p-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="option in triggerOptions"
            :key="option"
            class="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors"
            :class="[
              option === selectedTrigger 
                ? 'bg-red-500 text-white' 
                : 'bg-red-50 text-red-500 hover:bg-red-100'
            ]"
            @click="selectTrigger(option)"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
            {{ option }}
            <span class="w-4 h-4 border-[1.5px] border-current rounded-full flex items-center justify-center text-xs">?</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Connection Points -->
    <div class="flex justify-around mt-3">
      <div 
        v-for="(option, index) in triggerOptions" 
        :key="index"
        class="flex flex-col items-center"
      >
        <Handle
          type="source"
          :position="Position.Bottom"
          :id="'handle-' + index"
          class="w-3 h-3 !bg-red-500 cursor-pointer hover:scale-110 transition-transform"
        />
        <span class="mt-1 text-xs text-gray-500">{{ option }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Position, Handle } from '@vue-flow/core'

const props = defineProps<{
  isSelected?: boolean
}>()

const emit = defineEmits<{
  (e: 'select-trigger', type: string): void
}>()

const triggerOptions = [
  'Incoming Message',
  'Incoming Call',
  'REST API',
  'Subflow'
]

const selectedTrigger = ref(triggerOptions[0])

const selectTrigger = (option: string) => {
  selectedTrigger.value = option
  emit('select-trigger', option)
}
</script>