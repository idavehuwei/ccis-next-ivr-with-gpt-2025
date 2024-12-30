// src/components/nodes/GatherInputNode.vue
<template>
  <BaseNode
    type="gather_input"
    :title="nodeData.label"
    :is-selected="isSelected"
    :is-executing="isExecuting"
    :has-error="hasError"
  >
    <template #icon>
      <KeyboardIcon class="w-5 h-5 text-green-500" />
    </template>

    <template #default>
      <div class="p-4 space-y-4">
        <!-- Input Type Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Input Type</label>
          <div class="mt-2 flex space-x-2">
            <button 
              v-for="type in inputTypes" 
              :key="type.value"
              :class="[
                'px-3 py-1.5 rounded text-sm transition-colors',
                nodeData.inputType === type.value 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
              @click="selectInputType(type.value)"
            >
              {{ type.label }}
            </button>
          </div>
        </div>

        <!-- Prompt Message -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Prompt Message</label>
          <textarea
            v-model="nodeData.promptMessage"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300"
            placeholder="Enter prompt message..."
            @change="handleUpdate"
          ></textarea>
          <!-- Variable Suggestions -->
          <div class="mt-1 flex flex-wrap gap-2">
            <button
              v-for="variable in availableVariables"
              :key="variable.name"
              class="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
              @click="insertVariable(variable)"
            >
              {{ variable.name }}
            </button>
          </div>
        </div>

        <!-- Input Settings -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Timeout -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Timeout (seconds)</label>
            <input
              v-model.number="nodeData.timeout"
              type="number"
              min="1"
              max="300"
              class="mt-1 block w-full rounded-md border-gray-300"
              @change="handleUpdate"
            />
          </div>

          <!-- Attempts -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Max Attempts</label>
            <input
              v-model.number="nodeData.attempts"
              type="number"
              min="1"
              max="5"
              class="mt-1 block w-full rounded-md border-gray-300"
              @change="handleUpdate"
            />
          </div>
        </div>

        <!-- Input Specific Settings -->
        <template v-if="nodeData.inputType === 'dtmf'">
          <div>
            <label class="block text-sm font-medium text-gray-700">Expected Length</label>
            <input
              v-model.number="nodeData.dtmfLength"
              type="number"
              min="1"
              max="20"
              class="mt-1 block w-full rounded-md border-gray-300"
              @change="handleUpdate"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Finish Key</label>
            <select
              v-model="nodeData.finishOnKey"
              class="mt-1 block w-full rounded-md border-gray-300"
              @change="handleUpdate"
            >
              <option value="#">#</option>
              <option value="*">*</option>
              <option value="">None</option>
            </select>
          </div>
        </template>

        <template v-if="nodeData.inputType === 'speech'">
          <div>
            <label class="block text-sm font-medium text-gray-700">Language</label>
            <select
              v-model="nodeData.speechLanguage"
              class="mt-1 block w-full rounded-md border-gray-300"
              @change="handleUpdate"
            >
              <option value="en-US">English (US)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="zh-CN">Chinese</option>
            </select>
          </div>
        </template>

        <!-- Response Validation -->
        <div>
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="nodeData.enableValidation"
              class="rounded border-gray-300 text-green-600"
              @change="handleUpdate"
            />
            <span class="ml-2 text-sm text-gray-700">Enable Input Validation</span>
          </label>

          <template v-if="nodeData.enableValidation">
            <div class="mt-2 space-y-3">
              <select
                v-model="nodeData.validationType"
                class="block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              >
                <option value="any">Any Input</option>
                <option value="number">Number</option>
                <option value="digits">Digits Only</option>
                <option value="yesno">Yes/No</option>
                <option value="custom">Custom Pattern</option>
              </select>

              <template v-if="nodeData.validationType === 'custom'">
                <input
                  v-model="nodeData.validationPattern"
                  type="text"
                  class="block w-full rounded-md border-gray-300"
                  placeholder="Regular expression pattern"
                  @change="handleUpdate"
                />
              </template>

              <input
                v-model="nodeData.invalidMessage"
                type="text"
                class="block w-full rounded-md border-gray-300"
                placeholder="Invalid input message"
                @change="handleUpdate"
              />
            </div>
          </template>
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
        <span class="handle-label">Valid Input</span>
      </Handle>
      <Handle
        type="source"
        :position="Position.Bottom"
        id="invalid"
        class="handle-error"
      >
        <span class="handle-label">Invalid</span>
      </Handle>
      <Handle
        type="source"
        :position="Position.Bottom"
        id="timeout"
        class="handle-warning"
      >
        <span class="handle-label">Timeout</span>
      </Handle>
    </template>
  </BaseNode>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { Keyboard } from 'lucide-vue-next'
import BaseNode from './BaseNode.vue'
import { useFlowStore } from '@/stores/flow'

const props = defineProps<{
  id: string
  data: any
  isSelected?: boolean
}>()

const emit = defineEmits(['update'])
const flowStore = useFlowStore()

// Input types configuration
const inputTypes = [
  { value: 'dtmf', label: 'DTMF' },
  { value: 'speech', label: 'Speech' },
  { value: 'both', label: 'Both' }
]

// Node data with reactive state
const nodeData = ref({
  label: props.data.label || 'Gather Input',
  inputType: props.data.inputType || 'dtmf',
  promptMessage: props.data.promptMessage || '',
  timeout: props.data.timeout || 5,
  attempts: props.data.attempts || 3,
  dtmfLength: props.data.dtmfLength || 1,
  finishOnKey: props.data.finishOnKey || '#',
  speechLanguage: props.data.speechLanguage || 'en-US',
  enableValidation: props.data.enableValidation || false,
  validationType: props.data.validationType || 'any',
  validationPattern: props.data.validationPattern || '',
  invalidMessage: props.data.invalidMessage || 'Invalid input, please try again.'
})

// Computed
const availableVariables = computed(() => flowStore.variables)

const isExecuting = ref(false)
const hasError = ref(false)

// Methods
const selectInputType = (type: string) => {
  nodeData.value.inputType = type
  handleUpdate()
}

const insertVariable = (variable: any) => {
  const insertion = `{{${variable.name}}}`
  nodeData.value.promptMessage += insertion
  handleUpdate()
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
    type: 'gather_input',
    properties: {
      inputType: nodeData.value.inputType,
      promptMessage: nodeData.value.promptMessage,
      timeout: nodeData.value.timeout,
      attempts: nodeData.value.attempts,
      dtmfLength: nodeData.value.dtmfLength,
      finishOnKey: nodeData.value.finishOnKey,
      speechLanguage: nodeData.value.speechLanguage,
      validation: nodeData.value.enableValidation ? {
        type: nodeData.value.validationType,
        pattern: nodeData.value.validationPattern,
        invalidMessage: nodeData.value.invalidMessage
      } : null
    },
    transitions: [
      { event: 'success', next: undefined },
      { event: 'invalid', next: undefined },
      { event: 'timeout', next: undefined }
    ]
  }
}
</script>