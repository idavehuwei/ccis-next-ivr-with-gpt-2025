<template>
    <div class="flex flex-col items-center">
      <div class="w-3 h-3 bg-red-500 rounded-full cursor-pointer transition-transform hover:scale-125"/>
      <span class="mt-1 text-xs text-gray-500">{{ label }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    type: string
    label: string
  }>()
  </script>