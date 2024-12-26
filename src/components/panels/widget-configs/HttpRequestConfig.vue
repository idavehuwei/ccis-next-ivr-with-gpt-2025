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

    <!-- Required Configuration -->
    <div class="space-y-4">
      <!-- Request Method -->
      <div>
        <label class="block text-sm font-medium text-gray-500 mb-1">
          请求方法 <span class="text-red-500">*</span>
        </label>
        <select
          v-model="nodeData.method"
          class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
          @change="updateNode"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <!-- Request URL -->
      <div>
        <label class="block text-sm font-medium text-gray-500 mb-1">
          请求URL <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          v-model="nodeData.url"
          placeholder="https://example.com/api"
          class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
          @change="updateNode"
        />
      </div>

      <!-- Content Type -->
      <div>
        <label class="block text-sm font-medium text-gray-500 mb-1">
          内容类型 <span class="text-red-500">*</span>
        </label>
        <select
          v-model="nodeData.contentType"
          class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
          @change="updateNode"
        >
          <option value="application/x-www-form-urlencoded">Form URL Encoded</option>
          <option value="application/json">Application/JSON</option>
        </select>
      </div>
    </div>

    <!-- Optional Configuration -->
    <div class="bg-gray-50 p-4 rounded-lg space-y-4">
      <h3 class="text-sm font-medium text-gray-700">可选配置</h3>

      <!-- Request Body -->
      <div>
        <label class="block text-xs text-gray-500 mb-1">请求体</label>
        <textarea
          v-model="nodeData.body"
          rows="3"
          class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
          placeholder="请求体内容"
          @change="updateNode"
        ></textarea>
      </div>

      <!-- Authentication -->
      <div>
        <label class="flex items-center space-x-2">
          <input
            type="checkbox"
            v-model="nodeData.authenticateWithTwilio"
            class="text-blue-600 focus:ring-blue-500"
            @change="updateNode"
          />
          <span class="text-sm text-gray-700">使用Twilio认证</span>
        </label>
        <p class="mt-1 text-xs text-gray-500">
          仅在请求Twilio API时启用此选项
        </p>
      </div>

      <!-- HTTP Parameters -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-xs text-gray-500">HTTP参数</label>
          <button
            @click="addParameter"
            class="text-blue-600 hover:text-blue-700 text-sm"
          >
            添加
          </button>
        </div>
        <div class="space-y-2">
          <div
            v-for="(param, index) in nodeData.parameters"
            :key="index"
            class="grid grid-cols-2 gap-2"
          >
            <input
              v-model="param.key"
              placeholder="键名"
              class="px-2 py-1 text-sm border rounded"
              @change="updateNode"
            />
            <div class="flex space-x-2">
              <input
                v-model="param.value"
                placeholder="值"
                class="flex-1 px-2 py-1 text-sm border rounded"
                @change="updateNode"
              />
              <button
                @click="removeParameter(index)"
                class="text-red-500 hover:text-red-700"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
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

const nodeData = ref({
  ...props.node.data,
  method: props.node.data.method || 'GET',
  url: props.node.data.url || '',
  contentType: props.node.data.contentType || 'application/x-www-form-urlencoded',
  body: props.node.data.body || '',
  authenticateWithTwilio: props.node.data.authenticateWithTwilio || false,
  parameters: props.node.data.parameters || []
});

const addParameter = () => {
  nodeData.value.parameters.push({ key: '', value: '' });
  updateNode();
};

const removeParameter = (index: number) => {
  nodeData.value.parameters.splice(index, 1);
  updateNode();
};

const updateNode = () => {
  emit('update', {
    ...props.node,
    data: nodeData.value,
  });
};
</script> 