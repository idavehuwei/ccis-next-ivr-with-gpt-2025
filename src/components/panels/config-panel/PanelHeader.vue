<template>
  <div class="p-4 border-b">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <button
          v-if="!showWidgetLibrary"
          @click="$emit('toggle-widget-library')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <h2 class="font-medium text-gray-900">{{ title }}</h2>
      </div>
      <button
        @click="$emit('hide')"
        class="text-blue-600 hover:text-blue-700 text-sm"
      >
        隐藏
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  showWidgetLibrary?: boolean;
}>();

defineEmits<{
  (e: 'hide'): void;
  (e: 'toggle-widget-library'): void;
}>();
</script> 