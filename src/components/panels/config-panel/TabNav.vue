<template>
  <div class="flex mt-4 border-b">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="flex-1 px-4 py-2 text-sm font-medium border-b-2"
      :class="[
        modelValue === tab.value
          ? 'border-red-500 text-gray-900'
          : 'border-transparent text-gray-500 hover:text-gray-700',
      ]"
      @click="$emit('update:modelValue', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  label: string;
  value: string;
}

defineProps<{
  modelValue: string;
  tabs: Tab[];
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script> 