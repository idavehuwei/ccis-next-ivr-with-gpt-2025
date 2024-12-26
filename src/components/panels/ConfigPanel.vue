<template>
  <div class="bg-white border-l w-80 flex flex-col h-full">
    <!-- Panel Header -->
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
          <h2 class="font-medium text-gray-900">
            {{ getNodeTitle(selectedNode?.type) }}
          </h2>
        </div>
        <button
          @click="$emit('hide')"
          class="text-blue-600 hover:text-blue-700 text-sm"
        >
          Hide
        </button>
      </div>

      <!-- Tab Navigation -->
      <div class="flex mt-4 border-b">
        <button
          class="flex-1 px-4 py-2 text-sm font-medium border-b-2"
          :class="[
            currentTab === 'config'
              ? 'border-red-500 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          ]"
          @click="currentTab = 'config'"
        >
          Config
        </button>
        <button
          class="flex-1 px-4 py-2 text-sm font-medium border-b-2"
          :class="[
            currentTab === 'transitions'
              ? 'border-red-500 text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          ]"
          @click="currentTab = 'transitions'"
        >
          Transitions
        </button>
      </div>
    </div>

    <!-- Panel Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Set Variables Config -->
      <template v-if="selectedNode?.type === 'set_variables'">
        <div class="p-4 space-y-4">
          <!-- Widget Name -->
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              WIDGET NAME <span class="text-red-500">*</span>
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
              <h3 class="text-sm font-medium text-gray-700">Variables</h3>
              <button
                @click="addVariable"
                class="text-blue-600 hover:text-blue-700 text-sm"
              >
                Add
              </button>
            </div>

            <!-- Variables Table -->
            <div class="bg-white rounded border">
              <!-- Table Header -->
              <div class="grid grid-cols-2 gap-4 p-3 border-b bg-gray-50">
                <div class="text-xs font-medium text-gray-500">KEY</div>
                <div class="text-xs font-medium text-gray-500">VALUE</div>
              </div>

              <!-- Table Content -->
              <div class="divide-y">
                <div
                  v-for="(value, key) in nodeData.variables"
                  :key="key"
                  class="grid grid-cols-2 gap-4 p-3"
                >
                  <div class="text-sm text-gray-900">{{ key }}</div>
                  <div class="flex items-center justify-between">
                    <button
                      class="text-blue-600 hover:text-blue-700 text-sm underline"
                    >
                      View
                    </button>
                    <button
                      class="text-gray-500 hover:text-gray-700 text-sm underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Say/Play Config -->
      <template v-else-if="selectedNode?.type === 'say_play'">
        <div class="p-4 space-y-4">
          <!-- Widget Name -->
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              WIDGET NAME <span class="text-red-500">*</span>
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
            <label class="block text-sm font-medium text-gray-500 mb-1">
              TYPE
            </label>
            <div class="flex space-x-4">
              <label class="flex items-center space-x-2">
                <input 
                  type="radio" 
                  v-model="nodeData.type" 
                  value="say"
                  class="text-emerald-500 focus:ring-emerald-500"
                  @change="updateNode"
                />
                <span class="text-sm text-gray-700">Say</span>
              </label>
              <label class="flex items-center space-x-2">
                <input 
                  type="radio" 
                  v-model="nodeData.type" 
                  value="play"
                  class="text-emerald-500 focus:ring-emerald-500"
                  @change="updateNode"
                />
                <span class="text-sm text-gray-700">Play</span>
              </label>
            </div>
          </div>

          <!-- Message Content -->
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              MESSAGE
            </label>
            <textarea
              v-model="nodeData.message"
              rows="3"
              class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-emerald-500"
              placeholder="Enter your message here..."
              @change="updateNode"
            ></textarea>
            <div class="mt-1 text-xs text-gray-500">
              {{ nodeData.type === 'say' ? 'Text to be spoken' : 'Audio URL to be played' }}
            </div>
          </div>

          <!-- Voice Settings (for Say type) -->
          <div v-if="nodeData.type === 'say'" class="bg-gray-50 p-4 rounded-lg">
            <label class="block text-sm font-medium text-gray-500 mb-2">
              VOICE SETTINGS
            </label>
            <div class="space-y-3">
              <div>
                <label class="block text-xs text-gray-500 mb-1">VOICE</label>
                <select
                  v-model="nodeData.voice"
                  class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-emerald-500"
                  @change="updateNode"
                >
                  <option value="alice">Alice</option>
                  <option value="man">Man</option>
                  <option value="woman">Woman</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">LANGUAGE</label>
                  <select
                    v-model="nodeData.language"
                    class="w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-emerald-500"
                    @change="updateNode"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="es-ES">Spanish</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">SPEED</label>
                  <input
                    type="number"
                    v-model.number="nodeData.speed"
                    min="0.5"
                    max="2"
                    step="0.1"
                    class="w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-emerald-500"
                    @change="updateNode"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 其他节点类型的配置 -->
      <template v-else>
        <!-- 原有的节点配置内容 -->
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { IVRNode } from "@/types";

const props = defineProps<{
  selectedNode?: IVRNode | null;
  showWidgetLibrary?: boolean;
}>();

const emit = defineEmits<{
  (e: "hide"): void;
  (e: "toggle-widget-library"): void;
  (e: "update-node", node: IVRNode): void;
}>();

const currentTab = ref("config");
const nodeData = ref<any>({});

// 监听选中节点变化
watch(
  () => props.selectedNode,
  (newNode) => {
    if (newNode) {
      if (newNode.type === 'say_play') {
        nodeData.value = {
          ...newNode.data,
          type: newNode.data.type || 'say',
          message: newNode.data.message || 'Welcome to the sub flow!',
          voice: newNode.data.voice || 'alice',
          language: newNode.data.language || 'en-US',
          speed: newNode.data.speed || 1
        };
      } else if (newNode.type === 'set_variables') {
        nodeData.value = {
          ...newNode.data,
          variables: newNode.data.variables || {}
        };
      } else {
        nodeData.value = { ...newNode.data };
      }
    }
  },
  { deep: true }
);

// 添加变量
const addVariable = () => {
  nodeData.value.variables = nodeData.value.variables || {};
  const newKey = `variable_${Object.keys(nodeData.value.variables).length + 1}`;
  nodeData.value.variables[newKey] = "";
  updateNode();
};

// 更新节点
const updateNode = () => {
  if (props.selectedNode) {
    emit("update-node", {
      ...props.selectedNode,
      data: nodeData.value,
    });
  }
};

// 获取节点标题
const getNodeTitle = (type?: string) => {
  switch(type) {
    case 'set_variables':
      return 'SET VARIABLES';
    case 'say_play':
      return 'SAY/PLAY';
    default:
      return '节点配置';
  }
};
</script>