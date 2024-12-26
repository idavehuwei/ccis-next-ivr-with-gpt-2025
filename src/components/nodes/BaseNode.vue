<template>
    <div class="bg-white rounded-lg shadow-sm" :class="[width, {'ring-2 ring-blue-500': isSelected}]">
      <slot></slot>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    width?: string
    isSelected?: boolean
  }>()
  </script>
  