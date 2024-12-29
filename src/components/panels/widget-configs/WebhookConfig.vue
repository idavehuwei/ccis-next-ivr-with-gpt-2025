<template>
    <div class="webhook-config space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
        <input
          v-model="modelValue.url"
          type="text"
          class="w-full px-3 py-2 border rounded-md"
          placeholder="https://api.example.com/webhook"
          @change="emitUpdate"
        />
      </div>
  
      <!-- HTTP Method -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Method</label>
        <select
          v-model="modelValue.method"
          class="w-full px-3 py-2 border rounded-md"
          @change="emitUpdate"
        >
          <option value="POST">POST</option>
          <option value="GET">GET</option>
          <option value="PUT">PUT</option>
        </select>
      </div>
  
      <!-- Headers -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700">Headers</label>
          <button
            @click="addHeader"
            class="text-sm text-blue-600 hover:text-blue-700"
          >
            Add Header
          </button>
        </div>
        <div class="space-y-2">
          <div v-for="(value, key) in modelValue.headers" :key="key"
               class="flex items-center space-x-2">
            <input
              v-model="headerKeys[key]"
              type="text"
              class="flex-1 px-3 py-2 border rounded-md"
              placeholder="Header name"
            />
            <input
              v-model="modelValue.headers[key]"
              type="text"
              class="flex-1 px-3 py-2 border rounded-md"
              placeholder="Value"
            />
            <button
              @click="removeHeader(key)"
              class="text-red-500 hover:text-red-700"
            >
              <span class="sr-only">Remove</span>
              ×
            </button>
          </div>
        </div>
      </div>
  
      <!-- Authentication -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Authentication</label>
        <select
          v-model="modelValue.authentication.type"
          class="w-full px-3 py-2 border rounded-md mb-2"
          @change="emitUpdate"
        >
          <option value="">No Authentication</option>
          <option value="basic">Basic Auth</option>
          <option value="bearer">Bearer Token</option>
        </select>
  
        <template v-if="modelValue.authentication.type === 'basic'">
          <input
            v-model="modelValue.authentication.username"
            type="text"
            class="w-full px-3 py-2 border rounded-md mb-2"
            placeholder="Username"
            @change="emitUpdate"
          />
          <input
            v-model="modelValue.authentication.password"
            type="password"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Password"
            @change="emitUpdate"
          />
        </template>
  
        <template v-if="modelValue.authentication.type === 'bearer'">
          <input
            v-model="modelValue.authentication.token"
            type="text"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Bearer Token"
            @change="emitUpdate"
          />
        </template>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const props = defineProps<{
    modelValue: {
      url: string
      method: string
      headers: Record<string, string>
      authentication: {
        type: string
        username?: string
        password?: string
        token?: string
      }
    }
  }>()
  
  const emit = defineEmits(['update:modelValue'])
  
  const headerKeys = ref<Record<string, string>>({})
  
  const addHeader = () => {
    const key = `header${Object.keys(props.modelValue.headers).length}`
    props.modelValue.headers[key] = ''
    headerKeys.value[key] = ''
    emitUpdate()
  }
  
  const removeHeader = (key: string) => {
    delete props.modelValue.headers[key]
    delete headerKeys.value[key]
    emitUpdate()
  }
  
  const emitUpdate = () => {
    emit('update:modelValue', props.modelValue)
  }
  </script>