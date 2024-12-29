<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-lg">
        <!-- 标题 -->
        <div class="border-b px-4 py-3">
          <h3 class="text-lg font-medium text-gray-900">
            <slot name="title"></slot>
          </h3>
        </div>

        <!-- 内容 -->
        <div class="px-4 py-4">
          <slot name="content"></slot>
        </div>

        <!-- 底部按钮 -->
        <div class="border-t px-4 py-3">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close'])
</script>

<style scoped>
.fixed {
  background-color: rgba(0, 0, 0, 0.5);
}

.transform {
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
}
</style> 