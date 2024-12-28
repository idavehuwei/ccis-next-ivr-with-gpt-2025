<!-- src/components/config/EnqueueCallConfig.vue -->
<template>
    <div class="p-4 space-y-6">
      <!-- Basic Settings -->
      <div class="space-y-4">
        <h3 class="text-sm font-medium text-gray-900">Basic Settings</h3>
        
        <!-- Queue Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Queue Name</label>
          <select
            v-model="nodeConfig.queueName"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            @change="emitUpdate"
          >
            <option value="">Select a queue...</option>
            <option v-for="queue in queueOptions" :key="queue.id" :value="queue.id">
              {{ queue.name }}
            </option>
          </select>
        </div>
  
        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Priority</label>
          <input
            type="number"
            v-model.number="nodeConfig.priority"
            min="1"
            max="100"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            @change="emitUpdate"
          />
          <p class="mt-1 text-sm text-gray-500">Higher numbers indicate higher priority (1-100)</p>
        </div>
      </div>
  
      <!-- Queue Options -->
      <div class="space-y-4">
        <h3 class="text-sm font-medium text-gray-900">Queue Options</h3>
  
        <!-- Wait URL -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Wait URL</label>
          <input
            type="url"
            v-model="nodeConfig.waitUrl"
            placeholder="https://example.com/wait-music"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            @change="emitUpdate"
          />
          <p class="mt-1 text-sm text-gray-500">URL that hosts the audio to play while waiting</p>
        </div>
  
        <!-- Wait Time Settings -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Max Wait Time</label>
            <input
              type="number"
              v-model.number="nodeConfig.maxWaitTime"
              min="0"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @change="emitUpdate"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Time Unit</label>
            <select
              v-model="nodeConfig.timeUnit"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              @change="emitUpdate"
            >
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
            </select>
          </div>
        </div>
  
        <!-- Announcement Options -->
        <div class="space-y-3">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="nodeConfig.announcePosition"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              @change="emitUpdate"
            />
            <span class="ml-2 text-sm text-gray-700">Announce position in queue</span>
          </label>
          
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="nodeConfig.announceWaitTime"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              @change="emitUpdate"
            />
            <span class="ml-2 text-sm text-gray-700">Announce estimated wait time</span>
          </label>
        </div>
      </div>
  
      <!-- Customer Data -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-sm font-medium text-gray-900">Customer Data</h3>
          <button
            type="button"
            @click="addCustomData"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Data
          </button>
        </div>
  
        <div class="space-y-3">
          <div
            v-for="(data, index) in nodeConfig.customerData"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              type="text"
              v-model="data.key"
              placeholder="Key"
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @change="emitUpdate"
            />
            <input
              type="text"
              v-model="data.value"
              placeholder="Value"
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @change="emitUpdate"
            />
            <button
              type="button"
              @click="removeCustomData(index)"
              class="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  
  const props = defineProps<{
    nodeId: string
    data: {
      queueName?: string
      priority?: number
      waitUrl?: string
      maxWaitTime?: number
      timeUnit?: 'seconds' | 'minutes'
      announcePosition?: boolean
      announceWaitTime?: boolean
      customerData?: Array<{
        key: string
        value: string
      }>
    }
  }>()
  
  const emit = defineEmits<{
    (e: 'update', nodeId: string, data: any): void
  }>()
  
  // Mock queue options
  const queueOptions = [
    { id: 'support', name: 'Support Queue' },
    { id: 'sales', name: 'Sales Queue' },
    { id: 'service', name: 'Customer Service' }
  ]
  
  // Default configuration
  const defaultConfig = {
    queueName: '',
    priority: 10,
    waitUrl: '',
    maxWaitTime: 300,
    timeUnit: 'seconds',
    announcePosition: false,
    announceWaitTime: false,
    customerData: []
  }
  
  // Node configuration state
  const nodeConfig = ref({...defaultConfig})
  
  // Watch for prop changes
  watch(() => props.data, (newData) => {
    nodeConfig.value = {
      ...defaultConfig,
      ...newData,
      customerData: newData?.customerData || []
    }
  }, { immediate: true, deep: true })
  
  // Customer data management
  const addCustomData = () => {
    nodeConfig.value.customerData.push({ key: '', value: '' })
    emitUpdate()
  }
  
  const removeCustomData = (index: number) => {
    nodeConfig.value.customerData.splice(index, 1)
    emitUpdate()
  }
  
  // Emit update event
  const emitUpdate = () => {
    emit('update', props.nodeId, nodeConfig.value)
  }
  </script>