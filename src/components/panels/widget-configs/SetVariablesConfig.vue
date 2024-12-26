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

    <!-- Variables Section -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-700">变量</h3>
        <button
          @click="addVariable"
          class="text-blue-600 hover:text-blue-700 text-sm"
        >
          添加
        </button>
      </div>

      <!-- Variables Table -->
      <div class="bg-white rounded border">
        <div class="grid grid-cols-2 gap-4 p-3 border-b bg-gray-50">
          <div class="text-xs font-medium text-gray-500">键名</div>
          <div class="text-xs font-medium text-gray-500">值</div>
        </div>

        <div class="divide-y">
          <div
            v-for="(value, key) in nodeData.variables"
            :key="key"
            class="grid grid-cols-2 gap-4 p-3"
          >
            <div class="text-sm text-gray-900">{{ key }}</div>
            <div class="flex items-center justify-between">
              <button class="text-blue-600 hover:text-blue-700 text-sm underline">
                查看
              </button>
              <button class="text-gray-500 hover:text-gray-700 text-sm underline">
                编辑
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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

const nodeData = ref(props.node.data);

const addVariable = () => {
  nodeData.value.variables = nodeData.value.variables || {};
  const newKey = `variable_${Object.keys(nodeData.value.variables).length + 1}`;
  nodeData.value.variables[newKey] = "";
  updateNode();
};

const updateNode = () => {
  emit('update', {
    ...props.node,
    data: nodeData.value,
  });
};
</script> 