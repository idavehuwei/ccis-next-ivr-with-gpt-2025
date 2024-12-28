<!-- src/components/nodes/NLPIntentNode.vue -->
<template>
    <div class="relative">
      <div class="bg-white rounded-lg min-w-[300px] border-2" 
           :class="{ 'border-purple-500 ring-2 ring-purple-500': isSelected, 'border-gray-200': !isSelected }">
        <!-- Header -->
        <div class="bg-purple-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-medium text-base">{{ data.label || 'NLP Intent Classification' }}</span>
          </div>
        </div>
  
        <!-- Content -->
        <div class="p-4">
          <div class="space-y-4">
            <!-- NLP Service Selection -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">NLP SERVICE</label>
              <select
                v-model="data.service"
                class="w-full px-3 py-2 border rounded text-sm"
                @change="updateNode"
              >
                <option value="dialogflow">Dialogflow</option>
                <option value="luis">LUIS</option>
                <option value="lex">Amazon Lex</option>
                <option value="custom">Custom Endpoint</option>
              </select>
            </div>
  
            <!-- Custom Endpoint (if custom service selected) -->
            <div v-if="data.service === 'custom'">
              <label class="block text-xs font-medium text-gray-500 mb-1">ENDPOINT URL</label>
              <input
                type="url"
                v-model="data.endpointUrl"
                placeholder="https://your-nlp-service.com/analyze"
                class="w-full px-3 py-2 border rounded text-sm"
                @change="updateNode"
              />
            </div>
  
            <!-- Intent Mapping -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-xs font-medium text-gray-500">INTENT MAPPING</label>
                <button 
                  @click="addIntent"
                  class="text-purple-600 hover:text-purple-700 text-sm"
                >
                  Add Intent
                </button>
              </div>
              <div class="space-y-2">
                <div 
                  v-for="(intent, index) in data.intents" 
                  :key="index"
                  class="flex items-center gap-2"
                >
                  <input
                    type="text"
                    v-model="intent.name"
                    placeholder="Intent name"
                    class="flex-1 px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  />
                  <input
                    type="text"
                    v-model="intent.confidence"
                    placeholder="Min confidence"
                    class="w-24 px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  />
                  <button
                    @click="removeIntent(index)"
                    class="text-red-500 hover:text-red-600"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Connection Points -->
      <Handle
        type="target"
        :position="Position.Top"
        class="w-3 h-3 !bg-purple-500"
      />
      
      <!-- Dynamic outputs for each intent plus fallback -->
      <div class="flex justify-around mt-3">
        <div v-for="intent in data.intents" 
             :key="intent.name" 
             class="flex flex-col items-center">
          <Handle
            type="source"
            :position="Position.Bottom"
            :id="intent.name"
            class="w-3 h-3 !bg-purple-500"
          />
          <span class="mt-1 text-xs text-gray-500">{{ intent.name }}</span>
        </div>
        <div class="flex flex-col items-center">
          <Handle
            type="source"
            :position="Position.Bottom"
            id="fallback"
            class="w-3 h-3 !bg-purple-500"
          />
          <span class="mt-1 text-xs text-gray-500">Fallback</span>
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
      service?: string
      endpointUrl?: string
      intents: Array<{
        name: string
        confidence: string
      }>
    }
    isSelected?: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update', id: string, data: any): void
  }>()
  
  const addIntent = () => {
    props.data.intents.push({
      name: '',
      confidence: '0.7'
    })
    updateNode()
  }
  
  const removeIntent = (index: number) => {
    props.data.intents.splice(index, 1)
    updateNode()
  }
  
  const updateNode = () => {
    emit('update', props.id, props.data)
  }
  </script>