<!-- GatherInputNode.vue -->
<template>
  <BaseNode
    type="gather_input"
    :title="nodeData.label"
    :is-selected="isSelected"
    :is-executing="isExecuting"
    :has-error="hasError"
  >
    <template #icon>
      <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M8 9l4-4 4 4m0 6l-4 4-4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </template>

    <template #default>
      <div class="p-4 space-y-4">
        <!-- 输入类型选择 -->
        <div>
          <label class="block text-xs font-medium text-gray-500">VALIDATION TYPE</label>
          <select
            v-model="nodeData.validationType"
            class="w-full px-3 py-2 border rounded text-sm"
            @change="updateNode" 
          >
            <option value="any">Any Input</option>
            <option value="number">Number</option>
            <option value="dtmf">DTMF</option>
            <option value="voice">Voice</option>
          </select>
        </div>

        <!-- 提示语配置 -->
        <div>
          <label class="block text-xs font-medium text-gray-500">PROMPT</label>
          <textarea
            v-model="nodeData.prompt"
            rows="3"
            class="w-full px-3 py-2 border rounded text-sm"
            @change="updateNode"
          ></textarea>
        </div>

        <!-- 超时设置 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-500">TIMEOUT (SEC)</label>
            <input
              type="number"
              v-model.number="nodeData.timeout"
              min="1"
              max="300"
              class="w-full px-3 py-2 border rounded text-sm"
              @change="updateNode"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500">MAX ATTEMPTS</label>
            <input
              type="number" 
              v-model.number="nodeData.maxAttempts"
              min="1"
              max="5"
              class="w-full px-3 py-2 border rounded text-sm"
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
        id="valid"
        class="handle-success"
      >
        <span class="handle-label">Valid</span>
      </Handle>
      <Handle 
        type="source"
        :position="Position.Bottom"
        id="invalid"
        class="handle-warning"
      >
        <span class="handle-label">Invalid</span>
      </Handle>
      <Handle
        type="source"
        :position="Position.Bottom" 
        id="timeout"
        class="handle-error"
      >
        <span class="handle-label">Timeout</span>
      </Handle>
    </template>
  </BaseNode>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import BaseNode from './BaseNode.vue'

const props = defineProps<{
  id: string
  data: {
    label?: string
    prompt?: string
    validationType?: 'any' | 'number' | 'dtmf' | 'voice'
    timeout?: number
    maxAttempts?: number
  }
  isSelected?: boolean
}>()

const emit = defineEmits(['update'])

const nodeData = ref({
  label: props.data.label || 'Gather Input',
  prompt: props.data.prompt || 'Please provide input',
  validationType: props.data.validationType || 'any',
  timeout: props.data.timeout || 60,
  maxAttempts: props.data.maxAttempts || 3
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