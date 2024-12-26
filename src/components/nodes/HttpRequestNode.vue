<template>
  <BaseNode :node="node" :selected="selected">
    <template #icon>
      <div class="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
        <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
    </template>

    <template #content>
      <div class="flex flex-col min-w-[180px]">
        <div class="text-sm font-medium text-gray-900">
          {{ node.data.label || 'HTTP请求' }}
        </div>
        <div class="mt-1 flex items-center text-xs text-gray-500">
          <span 
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
            :class="getMethodClass(node.data.method)"
          >
            {{ node.data.method }}
          </span>
          <span class="ml-2 truncate">{{ getDisplayUrl(node.data.url) }}</span>
        </div>
      </div>
    </template>

    <template #connection-points>
      <ConnectionPoint
        type="target"
        position="left"
        :node-id="node.id"
      />
      <ConnectionPoint
        type="source"
        position="right"
        :node-id="node.id"
        handle-id="success"
        label="成功"
      />
      <ConnectionPoint
        type="source"
        position="right"
        :node-id="node.id"
        handle-id="failed"
        label="失败"
        class="translate-y-6"
      />
    </template>
  </BaseNode>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseNode from './BaseNode.vue';
import ConnectionPoint from './ConnectionPoint.vue';
import type { IVRNode } from '@/types';

const props = defineProps<{
  node: IVRNode;
  selected?: boolean;
}>();

// 根据HTTP方法返回对应的样式类
const getMethodClass = (method?: string) => {
  switch (method?.toUpperCase()) {
    case 'GET':
      return 'bg-blue-100 text-blue-800';
    case 'POST':
      return 'bg-green-100 text-green-800';
    case 'PUT':
      return 'bg-yellow-100 text-yellow-800';
    case 'DELETE':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// 处理URL显示
const getDisplayUrl = (url?: string) => {
  if (!url) return '未设置URL';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + urlObj.pathname;
  } catch {
    return url;
  }
};
</script> 