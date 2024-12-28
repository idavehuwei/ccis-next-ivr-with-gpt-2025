<!-- src/components/widget-configs/RecordConfig.vue -->
<template>
  <div class="p-4 space-y-6">
    <!-- Basic Settings -->
    <div class="space-y-4">
      <h3 class="font-medium text-gray-900">Basic Settings</h3>
      
      <!-- Widget Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Widget Name</label>
        <input
          type="text"
          v-model="nodeData.label"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          @change="updateNode"
        />
      </div>

      <!-- Recording Action -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Action</label>
        <select
          v-model="nodeData.action"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          @change="updateNode"
        >
          <option value="start">Start Recording</option>
          <option value="stop">Stop Recording</option>
        </select>
      </div>

      <!-- Recording Channels -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Channels</label>
        <select
          v-model="nodeData.channels"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          @change="updateNode"
        >
          <option value="mono">Mono (Single Channel)</option>
          <option value="dual">Dual (Both Legs)</option>
        </select>
        <p class="mt-1 text-sm text-gray-500">
          Dual channel records both sides of the conversation separately
        </p>
      </div>
    </div>

    <!-- Recording Settings -->
    <div class="space-y-4">
      <h3 class="font-medium text-gray-900">Recording Settings</h3>

      <!-- Max Length -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Max Length (seconds)
        </label>
        <input
          type="number"
          v-model.number="nodeData.maxLength"
          min="0"
          max="14400"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          @change="updateNode"
        />
        <p class="mt-1 text-sm text-gray-500">
          Maximum 14400 seconds (4 hours). Leave empty for unlimited.
        </p>
      </div>

      <!-- Recording Options -->
      <div class="space-y-3">
        <div class="relative flex items-start">
          <div class="flex h-5 items-center">
            <input
              type="checkbox"
              v-model="nodeData.trim"
              class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              @change="updateNode"
            />
          </div>
          <div class="ml-3">
            <label class="text-sm font-medium text-gray-700">
              Trim Silence
            </label>
            <p class="text-sm text-gray-500">
              Remove silence from the beginning and end of the recording
            </p>
          </div>
        </div>

        <div class="relative flex items-start">
          <div class="flex h-5 items-center">
            <input
              type="checkbox"
              v-model="nodeData.playBeep"
              class="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              @change="updateNode"
            />
          </div>
          <div class="ml-3">
            <label class="text-sm font-medium text-gray-700">
              Play Beep
            </label>
            <p class="text-sm text-gray-500">
              Play a beep before starting the recording
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Settings -->
    <div class="space-y-4">
      <h3 class="font-medium text-gray-900">Advanced Settings</h3>

      <!-- Status Callback URL -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Status Callback URL
        </label>
        <input
          type="url"
          v-model="nodeData.statusCallback"
          placeholder="https://example.com/recording-status"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          @change="updateNode"
        />
        <p class="mt-1 text-sm text-gray-500">
          Receive recording status updates at this URL
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  node: {
    id: string
    data: {
      label?: string
      action: 'start' | 'stop'
      channels?: 'mono' | 'dual'
      trim?: boolean
      playBeep?: boolean
      statusCallback?: string
      maxLength?: number
    }
  }
}>()

const emit = defineEmits<{
  (e: 'update', node: any): void
}>()

// Default configuration
const defaultData = {
  label: 'Record Call',
  action: 'start',
  channels: 'mono',
  trim: false,
  playBeep: true,
  maxLength: 0,
  statusCallback: ''
}

// Node data with reactive state
const nodeData = ref({...defaultData})

// Watch for property changes
watch(
  () => props.node,
  (newNode) => {
    nodeData.value = {
      ...defaultData,
      ...newNode.data
    }
  },
  { immediate: true, deep: true }
)

// Update node data
const updateNode = () => {
  emit('update', {
    ...props.node,
    data: nodeData.value
  })
}
</script>