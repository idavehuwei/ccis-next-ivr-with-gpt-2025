<template>
    <button 
      class="flex items-center justify-center space-x-1 px-4 py-2 rounded-full text-sm transition-colors"
      :class="[
        selected ? 'bg-red-500 text-white' : 'bg-red-100 text-red-500 hover:bg-red-200'
      ]"
      @click="$emit('click')"
    >
      <component :is="icon" class="w-4 h-4" />
      <span>{{ type }}</span>
    </button>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    type: string
    icon: string
    selected?: boolean
  }>()
  
  defineEmits<{
    (e: 'click'): void
  }>()
  </script>