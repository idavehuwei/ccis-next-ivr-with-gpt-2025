<!-- src/components/nodes/HttpRequestNode.vue -->
<template>
  <div class="relative">
    <div class="bg-white rounded-lg min-w-[300px] border-2" 
         :class="{ 'border-yellow-500 ring-2 ring-yellow-500': isSelected, 'border-gray-200': !isSelected }">
      <!-- Header -->
      <div class="bg-yellow-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="font-medium text-base">{{ data.label || 'Make HTTP Request' }}</span>
          <button class="w-5 h-5 text-white/80 hover:text-white">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <button class="text-white/80 hover:text-white">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-4">
        <div class="space-y-4">
          <!-- Request Method & URL -->
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">METHOD</label>
              <select 
                v-model="data.method"
                class="w-full px-3 py-2 border rounded text-sm"
                @change="updateNode"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-xs font-medium text-gray-500 mb-1">REQUEST URL</label>
              <input 
                type="text"
                v-model="data.url"
                placeholder="https://api.example.com/endpoint"
                class="w-full px-3 py-2 border rounded text-sm"
                @change="updateNode"
              />
            </div>
          </div>

          <!-- Content Type -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">CONTENT TYPE</label>
            <select 
              v-model="data.contentType"
              class="w-full px-3 py-2 border rounded text-sm"
              @change="updateNode"
            >
              <option value="application/json">application/json</option>
              <option value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</option>
              <option value="multipart/form-data">multipart/form-data</option>
              <option value="text/plain">text/plain</option>
            </select>
          </div>

          <!-- Request Body -->
          <div v-if="data.method !== 'GET'">
            <label class="block text-xs font-medium text-gray-500 mb-1">REQUEST BODY</label>
            <textarea
              v-model="data.body"
              rows="4"
              class="w-full px-3 py-2 border rounded text-sm font-mono"
              placeholder='{"key": "value"}'
              @change="updateNode"
            ></textarea>
          </div>

          <!-- Authentication -->
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="data.useAuth"
                class="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                @change="updateNode"
              />
              <span class="ml-2 text-sm text-gray-700">Use Authentication</span>
            </label>
            
            <div v-if="data.useAuth" class="space-y-2">
              <select 
                v-model="data.authType"
                class="w-full px-3 py-2 border rounded text-sm"
                @change="updateNode"
              >
                <option value="basic">Basic Auth</option>
                <option value="bearer">Bearer Token</option>
              </select>
              
              <template v-if="data.authType === 'basic'">
                <input
                  type="text"
                  v-model="data.username"
                  placeholder="Username"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
                <input
                  type="password"
                  v-model="data.password"
                  placeholder="Password"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
              </template>
              
              <template v-else-if="data.authType === 'bearer'">
                <input
                  type="text"
                  v-model="data.token"
                  placeholder="Bearer Token"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Connection Points -->
    <Handle
      type="target"
      :position="Position.Top"
      class="w-3 h-3 !bg-yellow-500"
    />
    <div class="flex justify-around mt-3">
      <div class="flex flex-col items-center">
        <Handle
          type="source"
          :position="Position.Bottom"
          id="success"
          class="w-3 h-3 !bg-yellow-500"
        />
        <span class="mt-1 text-xs text-gray-500 bg-green-100 px-2 py-0.5 rounded">Success</span>
      </div>
      <div class="flex flex-col items-center">
        <Handle
          type="source"
          :position="Position.Bottom"
          id="failed"
          class="w-3 h-3 !bg-yellow-500"
        />
        <span class="mt-1 text-xs text-gray-500 bg-red-100 px-2 py-0.5 rounded">Failed</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'

const props = defineProps<{
  id: string
  data: {
    label?: string
    method?: string
    url?: string
    contentType?: string
    body?: string
    useAuth?: boolean
    authType?: 'basic' | 'bearer'
    username?: string
    password?: string
    token?: string
  }
  isSelected?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', id: string, data: any): void
}>()

const updateNode = () => {
  emit('update', props.id, {
    ...props.data
  })
}
</script>