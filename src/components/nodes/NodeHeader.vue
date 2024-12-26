<template>
    <div class="flex items-center justify-between p-4">
      <div class="flex items-center space-x-2">
        <h3 class="text-xl" :class="titleColor">{{ title }}</h3>
        <button v-if="showHelp" class="w-5 h-5 text-gray-400 hover:text-gray-600">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <slot name="actions">
        <button class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </slot>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    title: string
    titleColor?: string
    showHelp?: boolean
  }>()
  </script>