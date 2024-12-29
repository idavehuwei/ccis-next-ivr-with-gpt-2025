<template>
  <div class="tabs">
    <div class="flex border-b">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="px-4 py-2 -mb-px"
        :class="modelValue === tab.value ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'"
        @click="$emit('update:modelValue', tab.value)"
      >
        {{ tab.title }}
      </button>
    </div>
    <div class="py-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlots, computed } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const slots = useSlots()

const tabs = computed(() => {
  return slots.default?.()
    .filter(vnode => vnode.type.__name === 'TabPanel')
    .map(vnode => ({
      title: vnode.children?.title?.[0]?.children,
      value: vnode.props?.value
    })) || []
})
</script> 