<template>
  <BaseNode
    type="outgoing_call"
    :title="nodeData.label"
    :is-selected="isSelected"
    :is-executing="isExecuting"
    :has-error="hasError"
  >
    <template #icon>
      <PhoneIcon class="w-5 h-5 text-green-500" />
    </template>

    <template #default>
      <div class="p-4 space-y-4">
        <!-- 拨号目标 -->
        <div>
          <label class="block text-xs font-medium text-gray-500">CALL TO</label>
          <div class="flex space-x-2">
            <input 
              type="text"
              v-model="nodeData.address"
              placeholder="{{contact.channel.address}}"
              class="flex-1 px-3 py-2 border rounded text-sm font-mono bg-gray-50"
              @change="updateNode"
            />
          </div>
        </div>

        <!-- 呼叫设置 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-500">TIMEOUT</label>
            <input
              type="number"
              v-model="nodeData.timeout"
              min="5"
              max="300"
              class="w-full px-3 py-2 border rounded text-sm"
              @change="updateNode"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500">CALLER ID</label>
            <input
              type="tel"
              v-model="nodeData.callerId"
              class="w-full px-3 py-2 border rounded text-sm"
              placeholder="+1234567890"
              @change="updateNode"
            />
          </div>
        </div>
      </div>
    </template>

    <template #handles>
      <Handle
        type="source"
        :position="Position.Bottom"
        id="answered"
        class="handle-success"
      >
        <span class="handle-label">Answered</span>
      </Handle>
      <Handle
        type="source" 
        :position="Position.Bottom"
        id="busy"
        class="handle-warning"
      >
        <span class="handle-label">Busy</span>
      </Handle>
      <Handle
        type="source"
        :position="Position.Bottom"
        id="failed"
        class="handle-error" 
      >
        <span class="handle-label">Failed</span>
      </Handle>
    </template>
  </BaseNode>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { Phone as PhoneIcon } from 'lucide-vue-next'
import BaseNode from './BaseNode.vue'

const props = defineProps<{
  id: string
  data: {
    label?: string
    address?: string
    timeout?: number
    callerId?: string
  }
  isSelected?: boolean
}>()

const emit = defineEmits(['update'])

const nodeData = ref({
  label: props.data.label || 'Make Call',
  address: props.data.address || '',
  timeout: props.data.timeout || 60,
  callerId: props.data.callerId || ''
})

const isExecuting = ref(false)
const hasError = ref(false)

const updateNode = () => {
  emit('update', {
    ...props.data,
    ...nodeData.value
  })
}
</script>