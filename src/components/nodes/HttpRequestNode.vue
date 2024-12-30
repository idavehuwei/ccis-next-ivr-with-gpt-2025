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
          <div>
            <label class="block text-xs font-medium text-gray-500">METHOD</label>
            <select
              v-model="nodeData.method"
              class="w-full px-3 py-2 border rounded text-sm"
              @change="updateNode"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="block text-xs font-medium text-gray-500">URL</label>
            <input
              type="text"
              v-model="nodeData.url"
              placeholder="https://api.example.com/endpoint"
              class="w-full px-3 py-2 border rounded text-sm"
              @change="updateNode"
            />
          </div>
        </div>

        <!-- Headers -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-xs font-medium text-gray-500">HEADERS</label>
            <button
              @click="addHeader"
              class="text-yellow-600 hover:text-yellow-700 text-sm"
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
                class="flex-1 px-3 py-2 border rounded text-sm"
                @change="updateHeaders"
              />
              <input
                v-model="nodeData.headers[key]"
                type="text"
                placeholder="Value"
                class="flex-1 px-3 py-2 border rounded text-sm"
                @change="updateNode"
              />
              <button @click="removeHeader(key)" class="text-red-500">
                <XIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Request Body -->
        <div>
          <label class="block text-xs font-medium text-gray-500">BODY</label>
          <div class="space-y-2">
            <select
              v-model="nodeData.contentType"
              class="w-full px-3 py-2 border rounded text-sm"
              @change="updateNode"
            >
              <option value="application/json">JSON</option>
              <option value="application/x-www-form-urlencoded">Form URL Encoded</option>
              <option value="text/plain">Plain Text</option>
            </select>
            <textarea
              v-model="nodeData.body"
              rows="4"
              class="w-full px-3 py-2 border rounded text-sm font-mono"
              placeholder="{}"
              @change="updateNode"
            ></textarea>
          </div>
        </div>
      </div>
    </template>

    <template #handles>
      <Handle
        type="source"
        :position="Position.Bottom"
        id="success"
        class="handle-success"
      >
        <span class="handle-label">Success</span>
      </Handle>
      <Handle
        type="source"
        :position="Position.Bottom"
        id="error"
        class="handle-error"
      >
        <span class="handle-label">Error</span>
      </Handle>
    </template>
  </BaseNode>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { Globe as GlobeIcon, X as XIcon } from 'lucide-vue-next' 
import BaseNode from './BaseNode.vue'

const props = defineProps<{
  id: string
  data: {
    label?: string
    method: string
    url: string
    headers: Record<string, string>
    contentType: string
    body: string
  }
  isSelected?: boolean
}>()

const emit = defineEmits(['update'])

const nodeData = ref({
  label: props.data.label || 'HTTP Request',
  method: props.data.method || 'GET',
  url: props.data.url || '',
  headers: props.data.headers || {},
  contentType: props.data.contentType || 'application/json',
  body: props.data.body || ''
})

const headerKeys = ref<Record<string, string>>({})
const isExecuting = ref(false)
const hasError = ref(false)

const addHeader = () => {
  const key = `header${Object.keys(nodeData.value.headers).length}`
  nodeData.value.headers[key] = ''
  headerKeys.value[key] = ''
  updateNode()
}

const removeHeader = (key: string) => {
  delete nodeData.value.headers[key]
  delete headerKeys.value[key]
  updateNode()
}

const updateHeaders = () => {
  const newHeaders: Record<string, string> = {}
  Object.entries(headerKeys.value).forEach(([key, headerKey]) => {
    if (headerKey && nodeData.value.headers[key]) {
      newHeaders[headerKey] = nodeData.value.headers[key]
    }
  })
  nodeData.value.headers = newHeaders
  updateNode()
}

const updateNode = () => {
  emit('update', {
    ...props.data,
    ...nodeData.value
  })
}
</script>