// src/components/nodes/SplitOnIntentNode.vue
<template>
  <BaseNode
    type="split_intent"
    :title="nodeData.label"
    :is-selected="isSelected"
    :is-executing="isExecuting"
    :has-error="hasError"
  >
    <template #icon>
      <GitBranchIcon class="w-5 h-5 text-purple-500" />
    </template>

    <template #default>
      <div class="p-4 space-y-4">
        <!-- NLP Service -->
        <div>
          <label class="block text-sm font-medium text-gray-700">NLP Service</label>
          <select
            v-model="nodeData.service"
            class="mt-1 w-full rounded-md border-gray-300"
            @change="handleUpdate"
          >
            <option value="dialogflow">Dialogflow</option>
            <option value="lex">Amazon Lex</option>
            <option value="luis">LUIS</option>
            <option value="custom">Custom Endpoint</option>
          </select>
        </div>

        <!-- Custom Endpoint -->
        <div v-if="nodeData.service === 'custom'">
          <label class="block text-sm font-medium text-gray-700">Endpoint URL</label>
          <input
            type="url"
            v-model="nodeData.endpointUrl"
            class="mt-1 w-full rounded-md border-gray-300"
            @change="handleUpdate"
          />
        </div>

        <!-- Intents -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700">Intents</label>
            <button
              @click="addIntent"
              class="text-sm text-purple-600 hover:text-purple-700"
            >
              Add Intent
            </button>
          </div>
          
          <div class="space-y-2">
            <div
              v-for="(intent, index) in nodeData.intents"
              :key="index"
              class="p-3 border rounded-lg bg-gray-50 space-y-2"
            >
              <!-- Intent Name -->
              <div class="grid grid-cols-2 gap-2">
                <input
                  v-model="intent.name"
                  type="text"
                  class="rounded-md border-gray-300"
                  placeholder="Intent name"
                  @change="handleUpdate"
                />
                <input
                  v-model="intent.confidence"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  class="rounded-md border-gray-300"
                  placeholder="Min confidence"
                  @change="handleUpdate"
                />
              </div>

              <!-- Training Phrases -->
              <div class="space-y-1">
                <div
                  v-for="(phrase, pIndex) in intent.trainingPhrases"
                  :key="pIndex"
                  class="flex items-center gap-2"
                >
                  <input
                    v-model="intent.trainingPhrases[pIndex]"
                    type="text"
                    class="flex-1 rounded-md border-gray-300 text-sm"
                    placeholder="Training phrase"
                    @change="handleUpdate"
                  />
                  <button
                    @click="removePhrase(index, pIndex)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <XIcon class="w-4 h-4" />
                  </button>
                </div>
                <button
                  @click="addPhrase(index)"
                  class="text-sm text-purple-600 hover:text-purple-700"
                >
                  Add Phrase
                </button>
              </div>

              <!-- Remove Intent -->
              <button
                @click="removeIntent(index)"
                class="text-red-500 hover:text-red-700 w-full text-center pt-2 border-t"
              >
                Remove Intent
              </button>
            </div>
          </div>
        </div>

        <!-- Fallback Settings -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Fallback Handling</label>
          <select
            v-model="nodeData.fallbackMode"
            class="mt-1 w-full rounded-md border-gray-300"
            @change="handleUpdate"
          >
            <option value="default">Use Default Output</option>
            <option value="retry">Retry With Prompt</option>
            <option value="skip">Skip (Continue Flow)</option>
          </select>

          <div v-if="nodeData.fallbackMode === 'retry'" class="mt-2">
            <input
              v-model="nodeData.fallbackPrompt"
              type="text"
              class="w-full rounded-md border-gray-300"
              placeholder="Retry prompt message..."
              @change="handleUpdate"
            />
          </div>
        </div>
      </div>
    </template>

    <template #handles>
      <!-- Dynamic Intent Handles -->
      <div 
        v-for="intent in nodeData.intents"
        :key="intent.name"
        class="handle-wrapper"
      >
        <Handle
          type="source"
          :position="Position.Right"
          :id="intent.name"
          class="handle-intent"
        >
          <span class="handle-label">{{ intent.name }}</span>
        </Handle>
      </div>
      <!-- Fallback Handle -->
      <Handle
        type="source"
        :position="Position.Right"
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
import { GitBranch, X } from 'lucide-vue-next'
import BaseNode from './BaseNode.vue'

const props = defineProps<{
  id: string
  data: any
  isSelected?: boolean
}>()

const emit = defineEmits(['update'])

const nodeData = ref({
  label: props.data.label || 'Split on Intent',
  service: props.data.service || 'dialogflow',
  endpointUrl: props.data.endpointUrl || '',
  intents: props.data.intents || [],
  fallbackMode: props.data.fallbackMode || 'default',
  fallbackPrompt: props.data.fallbackPrompt || ''
})

const isExecuting = ref(false)
const hasError = ref(false)

// Intent Management
const addIntent = () => {
  nodeData.value.intents.push({
    name: '',
    confidence: 0.7,
    trainingPhrases: []
  })
  handleUpdate()
}

const removeIntent = (index: number) => {
  nodeData.value.intents.splice(index, 1)
  handleUpdate()
}

const addPhrase = (intentIndex: number) => {
  nodeData.value.intents[intentIndex].trainingPhrases.push('')
  handleUpdate()
}

const removePhrase = (intentIndex: number, phraseIndex: number) => {
  nodeData.value.intents[intentIndex].trainingPhrases.splice(phraseIndex, 1)
  handleUpdate()
}

const handleUpdate = () => {
  emit('update', {
    ...props.data,
    ...nodeData.value
  })
}

// Flow State Conversion
const toFlowState = () => ({
  name: props.id,
  type: 'split_intent',
  properties: {
    service: nodeData.value.service,
    endpointUrl: nodeData.value.service === 'custom' ? nodeData.value.endpointUrl : undefined,
    intents: nodeData.value.intents,
    fallback: {
      mode: nodeData.value.fallbackMode,
      prompt: nodeData.value.fallbackPrompt
    }
  },
  transitions: [
    ...nodeData.value.intents.map(intent => ({
      event: intent.name,
      next: undefined,
      conditions: [{
        type: 'intent',
        intentName: intent.name,
        confidence: intent.confidence
      }]
    })),
    { event: 'fallback', next: undefined }
  ]
})

defineExpose({
  getIntentAnalysis: () => ({
    isAnalyzing: isExecuting.value,
    hasError: hasError.value,
    lastDetectedIntent: null // 实际实现中需要跟踪最后检测到的意图
  })
})
</script>

<style scoped>
.handle-intent {
  @apply bg-purple-500;
}

.handle-warning {
  @apply bg-yellow-500;
}

.handle-wrapper {
  @apply my-2;
}
</style>