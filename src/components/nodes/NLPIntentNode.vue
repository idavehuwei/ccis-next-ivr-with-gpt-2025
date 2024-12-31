<template>
  <BaseNode
    type="nlp_intent"
    :title="nodeData.label"
    :is-selected="isSelected"
    :is-executing="isExecuting"
    :has-error="hasError"
  >
    <template #icon>
      <BrainIcon class="w-5 h-5 text-purple-500" />
    </template>

    <template #default>
      <div class="p-4 space-y-4">
        <div>
          <label class="block text-xs font-medium text-gray-500">NLP SERVICE</label>
          <select
            v-model="nodeData.service"
            class="w-full px-3 py-2 border rounded text-sm"
            @change="updateNode"
          >
            <option value="dialogflow">Dialogflow</option>
            <option value="luis">LUIS</option>
            <option value="lex">Amazon Lex</option>
            <option value="watson">Watson</option> <!-- 新增Watson支持 -->
          </select>
        </div>

        <div>
          <div class="flex justify-between items-center">
            <label class="text-xs font-medium text-gray-500">INTENTS</label>
            <button 
              @click="addIntent"
              class="text-purple-600 hover:text-purple-700 text-sm"
            >
              Add Intent
            </button>
          </div>
          <div class="space-y-2 mt-2">
            <div v-for="(intent, index) in nodeData.intents" :key="index">
              <div class="flex items-center gap-2">
                <input
                  v-model="intent.name"
                  class="flex-1 px-3 py-2 border rounded text-sm"
                  placeholder="Intent name" 
                  @change="updateNode"
                />
                <input
                  v-model="intent.confidence"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  class="w-24 px-3 py-2 border rounded text-sm"
                  @change="updateNode" 
                />
                <button @click="removeIntent(index)" class="text-red-500">
                  <XIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #handles>
      <div v-for="intent in nodeData.intents" :key="intent.name">
        <Handle
          type="source"
          :position="Position.Bottom"
          :id="intent.name"
          class="handle-intent"
        >
          <span class="handle-label">{{ intent.name }}</span>
        </Handle>
      </div>
      <Handle
        type="source"
        :position="Position.Bottom"
        id="fallback"
        class="handle-warning"
      >
        <span class="handle-label">Fallback</span>  
      </Handle>
    </template>
  </BaseNode>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { Brain as BrainIcon, X as XIcon } from 'lucide-vue-next'
import BaseNode from './BaseNode.vue'

const props = defineProps<{
  id: string
  data: {
    label?: string
    service?: string
    intents: Array<{
      name: string
      confidence: number
    }>
  }
  isSelected?: boolean
}>()

const emit = defineEmits(['update'])

const nodeData = ref({
  label: props.data.label || 'NLP Intent',
  service: props.data.service || 'dialogflow',
  intents: props.data.intents || []
})

const isExecuting = ref(false)
const hasError = ref(false)

const addIntent = () => {
  nodeData.value.intents.push({
    name: '',
    confidence: 0.7
  })
  updateNode()
}

const removeIntent = (index: number) => {
  nodeData.value.intents.splice(index, 1)
  updateNode()
}

const updateNode = () => {
  emit('update', {
    ...props.data,
    ...nodeData.value
  })
}
</script>