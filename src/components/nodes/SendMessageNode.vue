// src/components/nodes/SendMessageNode.vue
<template>
  <BaseNode
    type="send_message"
    :title="nodeData.label"
    :is-selected="isSelected"
    :is-executing="isExecuting"
    :has-error="hasError"
    @update="handleUpdate"
  >
    <template #icon>
      <MessageCircleIcon class="w-5 h-5" />
    </template>

    <template #default>
      <div class="space-y-4 p-4">
        <!-- Message Template -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Template</label>
          <select 
            v-model="nodeData.templateId"
            class="mt-1 block w-full rounded-md border-gray-300"
            @change="handleUpdate"
          >
            <option value="">Select template...</option>
            <option v-for="template in templates" :key="template.id" :value="template.id">
              {{ template.name }}
            </option>
          </select>
        </div>

        <!-- Message Content -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            v-model="nodeData.content"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300"
            @change="handleUpdate"
          ></textarea>
        </div>

        <!-- Variables -->
        <div v-if="availableVariables.length">
          <label class="block text-sm font-medium text-gray-700">Variables</label>
          <div class="mt-1 flex flex-wrap gap-2">
            <button
              v-for="variable in availableVariables"
              :key="variable.name"
              class="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              @click="insertVariable(variable)"
            >
              {{ variable.name }}
            </button>
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
import { ref, computed } from 'vue'
import { MessageCircle } from 'lucide-vue-next'
import { Position, Handle } from '@vue-flow/core'
import BaseNode from './BaseNode.vue'
import { useMessageStore } from '@/stores/message'

const props = defineProps<{
  id: string
  data: any
  isSelected?: boolean
}>()

const emit = defineEmits(['update'])

const messageStore = useMessageStore()

// State
const nodeData = ref({
  label: props.data.label || 'Send Message',
  templateId: props.data.templateId || '',
  content: props.data.content || '',
  variables: props.data.variables || {}
})

// Computed
const templates = computed(() => messageStore.templates)
const availableVariables = computed(() => messageStore.variables)

const isExecuting = ref(false)
const hasError = ref(false)

// Methods
const handleUpdate = () => {
  emit('update', {
    ...props.data,
    ...nodeData.value
  })
}

const insertVariable = (variable: any) => {
  const insertion = `{{${variable.name}}}`
  nodeData.value.content += insertion
  handleUpdate()
}

// Convert to Flow State
const toFlowState = () => {
  return {
    name: props.id,
    type: 'send_message',
    properties: {
      templateId: nodeData.value.templateId,
      content: nodeData.value.content,
      variables: nodeData.value.variables
    },
    transitions: [
      { event: 'success', next: undefined },
      { event: 'error', next: undefined }
    ]
  }
}
</script>