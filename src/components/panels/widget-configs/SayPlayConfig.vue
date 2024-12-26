<template>
  <div class="p-4 space-y-4">
    <!-- Widget Name -->
    <div>
      <label class="block text-sm font-medium text-gray-500 mb-1">
        组件名称 <span class="text-red-500">*</span>
      </label>
      <input
        type="text"
        v-model="nodeData.label"
        class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
        @change="updateNode"
      />
    </div>

    <!-- Message Type -->
    <div>
      <label class="block text-sm font-medium text-gray-500 mb-1">类型</label>
      <div class="flex space-x-4">
        <label class="flex items-center space-x-2">
          <input 
            type="radio" 
            v-model="nodeData.type" 
            value="say"
            class="text-emerald-500 focus:ring-emerald-500"
            @change="updateNode"
          />
          <span class="text-sm text-gray-700">语音</span>
        </label>
        <label class="flex items-center space-x-2">
          <input 
            type="radio" 
            v-model="nodeData.type" 
            value="play"
            class="text-emerald-500 focus:ring-emerald-500"
            @change="updateNode"
          />
          <span class="text-sm text-gray-700">播放</span>
        </label>
      </div>
    </div>

    <!-- 其他配置保持不变... -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { IVRNode } from '@/types';

const props = defineProps<{
  node: IVRNode;
}>();

const emit = defineEmits<{
  (e: 'update', node: IVRNode): void;
}>();

const nodeData = ref({
  ...props.node.data,
  type: props.node.data.type || 'say',
  message: props.node.data.message || '欢迎来到子流程！',
  voice: props.node.data.voice || 'alice',
  language: props.node.data.language || 'zh-CN',
  speed: props.node.data.speed || 1
});

const updateNode = () => {
  emit('update', {
    ...props.node,
    data: nodeData.value,
  });
};
</script> 