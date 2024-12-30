// src/components/nodes/HttpRequestNode.vue
<template>
  <BaseNode
    type="http_request"
    :title="nodeData.label"
    :is-selected="isSelected"
    :is-executing="isExecuting"
    :has-error="hasError"
  >
    <template #icon>
      <GlobeIcon class="w-5 h-5 text-yellow-500" />
    </template>

    <template #default>
      <div class="p-4 space-y-4">
        <!-- HTTP Method & URL -->
        <div class="grid grid-cols-3 gap-4">
          <!-- Method -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Method</label>
            <select
              v-model="nodeData.method"
              class="mt-1 block w-full rounded-md border-gray-300"
              @change="handleUpdate"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <!-- URL -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="text"
              v-model="nodeData.url"
              placeholder="https://api.example.com/endpoint"
              class="mt-1 block w-full rounded-md border-gray-300"
              @change="handleUpdate"
            />
          </div>
        </div>

        <!-- Headers -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700">Headers</label>
            <button
              @click="addHeader"
              class="text-sm text-yellow-600 hover:text-yellow-700"
            >
              Add Header
            </button>
          </div>
          <div class="space-y-2">
            <div
              v-for="(value, key) in nodeData.headers"
              :key="key"
              class="flex items-center gap-2"
            >
              <input
                v-model="headerKeys[key]"
                type="text"
                placeholder="Header name"
                class="flex-1 rounded-md border-gray-300"
                @change="updateHeaders"
              />
              <input
                v-model="nodeData.headers[key]"
                type="text"
                placeholder="Value"
                class="flex-1 rounded-md border-gray-300"
                @change="handleUpdate"
              />
              <button
                @click="removeHeader(key)"
                class="text-red-500 hover:text-red-700"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Request Body -->
        <div v-if="showRequestBody">
          <label class="block text-sm font-medium text-gray-700">Request Body</label>
          <select
            v-model="nodeData.contentType"
            class="mt-1 block w-full rounded-md border-gray-300 mb-2"
            @change="handleUpdate"
          >
            <option value="application/json">JSON</option>
            <option value="application/x-www-form-urlencoded">Form URL Encoded</option>
            <option value="multipart/form-data">Multipart Form Data</option>
            <option value="text/plain">Plain Text</option>
          </select>

          <template v-if="nodeData.contentType === 'application/json'">
            <div class="relative">
              <button
                @click="formatJson"
                class="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                title="Format JSON"
              >
                <CodeIcon class="w-5 h-5" />
              </button>
              <textarea
                v-model="nodeData.body"
                rows="5"
                class="font-mono mt-1 block w-full rounded-md border-gray-300"
                placeholder="{}"
                @change="handleUpdate"
              ></textarea>
            </div>
          </template>
          <template v-else>
            <textarea
              v-model="nodeData.body"
              rows="5"
              class="mt-1 block w-full rounded-md border-gray-300"
              @change="handleUpdate"
            ></textarea>
          </template>
        </div>

        <!-- Advanced Settings -->
        <div class="space-y-3">
          <!-- Timeout -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Timeout (ms)</label>
            <input
              type="number"
              v-model.number="nodeData.timeout"
              min="0"
              step="1000"
              class="mt-1 block w-full rounded-md border-gray-300"
              @change="handleUpdate"
            />
          </div>

          <!-- Retry Settings -->
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="nodeData.retry.enabled"
                class="rounded border-gray-300 text-yellow-600"
                @change="handleUpdate"
              />
              <span class="ml-2 text-sm text-gray-700">Enable Retry</span>
            </label>

            <template v-if="nodeData.retry.enabled">
              <div class="grid grid-cols-2 gap-4 pl-6">
                <div>
                  <label class="block text-sm text-gray-700">Max Attempts</label>
                  <input
                    type="number"
                    v-model.number="nodeData.retry.maxAttempts"
                    min="1"
                    class="mt-1 block w-full rounded-md border-gray-300"
                    @change="handleUpdate"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-700">Delay (ms)</label>
                  <input
                    type="number"
                    v-model.number="nodeData.retry.delay"
                    min="0"
                    step="1000"
                    class="mt-1 block w-full rounded-md border-gray-300"
                    @change="handleUpdate"
                  />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <template #handles>
      <Handle
        type="source"
        :position="Position.Right"
        id="success"
        class="handle-success"
      >
        <span class="handle-label">Success</span>
      </Handle>
      <Handle
        type="source"
        :position="Position.Right"
        id="error"
        class="handle-error"
      >
        <span class="handle-label">Error</span>
      </Handle>
    </template>
  </BaseNode>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { Globe, Trash, Code } from 'lucide-vue-next'
import BaseNode from './BaseNode.vue'

const props = defineProps<{
  id: string
  data: any
  isSelected?: boolean
}>()

const emit = defineEmits(['update'])

// Node data
const nodeData = ref({
  label: props.data.label || 'HTTP Request',
  method: props.data.method || 'GET',
  url: props.data.url || '',
  headers: props.data.headers || {},
  contentType: props.data.contentType || 'application/json',
  body: props.data.body || '',
  timeout: props.data.timeout || 30000,
  retry: props.data.retry || {
    enabled: false,
    maxAttempts: 3,
    delay: 1000
  }
})

const headerKeys = ref<Record<string, string>>({})

// Computed
const showRequestBody = computed(() => 
  ['POST', 'PUT', 'PATCH'].includes(nodeData.value.method)
)

const isExecuting = ref(false)
const hasError = ref(false)

// Methods
const addHeader = () => {
  const key = `header${Object.keys(nodeData.value.headers).length}`
  nodeData.value.headers[key] = ''
  headerKeys.value[key] = ''
  handleUpdate()
}

const removeHeader = (key: string) => {
  delete nodeData.value.headers[key]
  delete headerKeys.value[key]
  handleUpdate()
}

const updateHeaders = () => {
  const newHeaders: Record<string, string> = {}
  Object.entries(headerKeys.value).forEach(([key, headerKey]) => {
    if (headerKey && nodeData.value.headers[key]) {
      newHeaders[headerKey] = nodeData.value.headers[key]
    }
  })
  nodeData.value.headers = newHeaders
  handleUpdate()
}

const formatJson = () => {
  try {
    const parsed = JSON.parse(nodeData.value.body)
    nodeData.value.body = JSON.stringify(parsed, null, 2)
    handleUpdate()
  } catch (error) {
    // Invalid JSON - keep as is
  }
}

const handleUpdate = () => {
  emit('update', {
    ...props.data,
    ...nodeData.value
  })
}

// Convert to Flow State
const toFlowState = () => {
  return {
    name: props.id,
    type: 'http_request',
    properties: {
      method: nodeData.value.method,
      url: nodeData.value.url,
      headers: nodeData.value.headers,
      contentType: nodeData.value.contentType,
      body: nodeData.value.body,
      timeout: nodeData.value.timeout,
      retry: nodeData.value.retry
    },
    transitions: [
      { event: 'success', next: undefined },
      { event: 'error', next: undefined }
    ]
  }
}
</script>