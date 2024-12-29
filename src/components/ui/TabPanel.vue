<template>
  <div v-show="modelValue === value">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: string
  modelValue?: string
}>()
</script> 