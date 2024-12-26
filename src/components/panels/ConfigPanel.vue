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
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          <h2 class="font-medium text-gray-900">{{ selectedNode ? getNodeTitle(selectedNode.type) : title }}</h2>
          <button v-if="showHelp" class="text-gray-400 hover:text-gray-600">
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <button 
          @click="$emit('hide')" 
          class="text-blue-600 hover:text-blue-700 text-sm"
        >
          Hide
        </button>
      </div>

      <!-- Tab Navigation -->
      <div v-if="!selectedNode" class="flex mt-4 border-b">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="px-4 py-2 text-sm font-medium -mb-px"
          :class="[
            currentTab === tab.id 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
          @click="currentTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- Panel Content -->
    <div class="flex-1 overflow-y-auto">
      <template v-if="selectedNode">
        <div v-if="currentTab === 'config'" class="p-4 space-y-4">
          <!-- Common Settings -->
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              NODE NAME
            </label>
            <input
              type="text"
              v-model="nodeData.label"
              class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
              @change="updateNode"
            />
          </div>

          <!-- Trigger Node Settings -->
          <template v-if="selectedNode.type === 'trigger'">
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">触发方式</h3>
                <div class="space-y-2">
                  <label 
                    v-for="option in triggerOptions" 
                    :key="option"
                    class="flex items-center space-x-2"
                  >
                    <input
                      type="radio"
                      name="trigger"
                      :value="option"
                      v-model="nodeData.trigger"
                      class="text-blue-500 focus:ring-blue-500"
                      @change="updateNode"
                    />
                    <span class="text-sm text-gray-700">{{ option }}</span>
                  </label>
                </div>
              </div>

              <div v-if="nodeData.trigger === 'REST API'">
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  Webhook URL
                </label>
                <div class="flex items-center">
                  <input
                    type="text"
                    disabled
                    :value="getWebhookUrl()"
                    class="flex-1 px-3 py-2 border rounded-md text-sm bg-gray-50"
                  />
                  <button class="ml-2 text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- Send & Reply Node Settings -->
          <template v-if="selectedNode.type === 'send_reply'">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  等待时间(秒)
                </label>
                <input
                  type="number"
                  v-model.number="nodeData.waitTime"
                  min="0"
                  class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
                  @change="updateNode"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  消息内容
                </label>
                <textarea
                  v-model="nodeData.replyContent"
                  rows="4"
                  class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
                  @change="updateNode"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  回复失败处理
                </label>
                <select
                  v-model="nodeData.failureAction"
                  class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
                  @change="updateNode"
                >
                  <option value="retry">重试</option>
                  <option value="skip">跳过</option>
                  <option value="fail">失败</option>
                </select>
              </div>
            </div>
          </template>
        </div>
      </template>

      <template v-else>
        <div v-if="currentTab === 'config'" class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              FLOW NAME *
            </label>
            <input
              type="text"
              v-model="flowName"
              class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              REST API URL
            </label>
            <div class="flex items-center">
              <input
                type="text"
                disabled
                :value="apiUrl"
                class="flex-1 px-3 py-2 border rounded-md text-sm bg-gray-50"
              />
              <button class="ml-2 text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2z" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              TEST USERS *
            </label>
            <textarea
              v-model="testUsers"
              rows="3"
              placeholder="Add phone numbers (separated by commas)"
              class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        <div v-else-if="currentTab === 'transitions'" class="p-4">
          <div class="text-sm text-gray-500">
            暂无转换配置。
          </div>
        </div>
      </template>
    </div>

    <!-- Panel Footer -->
    <div class="p-4 border-t bg-gray-50">
      <button 
        class="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        @click="saveChanges"
      >
        保存更改
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { IVRNode } from '@/types'
import { NODE_TYPES } from '@/constants/node-types'

const props = defineProps<{
title?: string
showHelp?: boolean
showWidgetLibrary?: boolean
selectedNode?: IVRNode | null
}>()

const emit = defineEmits<{
(e: 'hide'): void
(e: 'toggle-widget-library'): void
(e: 'update-node', node: IVRNode): void
(e: 'save'): void
}>()

// Tabs configuration
const currentTab = ref('config')
const tabs = [
{ id: 'config', name: 'Config' },
{ id: 'transitions', name: 'Transitions' }
]

// Flow settings
const flowName = ref('')
const apiUrl = ref('https://your-api.com/flows')
const testUsers = ref('')

// Node settings
const nodeData = ref<any>({})
const triggerOptions = [
'Incoming Message',
'Incoming Call',
'REST API',
'Subflow'
]

// Watch for selected node changes
watch(
() => props.selectedNode,
(newNode) => {
  if (newNode) {
    nodeData.value = { ...newNode.data }
  } else {
    nodeData.value = {}
  }
},
{ immediate: true }
)

// Helper functions
const getNodeTitle = (type: string) => {
const nodeType = Object.values(NODE_TYPES).find(t => t.type === type)
return nodeType ? nodeType.name : '节点配置'
}

const getWebhookUrl = () => {
return `${apiUrl.value}/webhook/${props.selectedNode?.id}`
}

// Event handlers
const updateNode = () => {
if (props.selectedNode) {
  emit('update-node', {
    ...props.selectedNode,
    data: nodeData.value
  })
}
}

const saveChanges = () => {
emit('save')
}
</script>