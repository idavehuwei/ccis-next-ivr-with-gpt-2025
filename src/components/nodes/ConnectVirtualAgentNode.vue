<!-- src/components/nodes/ConnectVirtualAgentNode.vue -->
<template>
    <div class="relative">
      <div class="bg-white rounded-lg min-w-[300px] border-2" 
           :class="{ 'border-indigo-500 ring-2 ring-indigo-500': isSelected, 'border-gray-200': !isSelected }">
        <!-- Header -->
        <div class="bg-indigo-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" 
                stroke-width="2"/>
            </svg>
            <span class="font-medium text-base">{{ data.label || 'Connect Virtual Agent' }}</span>
          </div>
          <button class="text-white/80 hover:text-white">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
        </div>
  
        <!-- Content -->
        <div class="p-4">
          <div class="space-y-4">
            <!-- Agent Selection -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">VIRTUAL AGENT</label>
              <select 
                v-model="data.agentId"
                class="w-full px-3 py-2 border rounded text-sm"
                @change="updateNode"
              >
                <option value="">Select Virtual Agent...</option>
                <option v-for="agent in virtualAgents" :key="agent.id" :value="agent.id">
                  {{ agent.name }}
                </option>
              </select>
            </div>
  
            <!-- Language -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">LANGUAGE</label>
              <select 
                v-model="data.language"
                class="w-full px-3 py-2 border rounded text-sm"
                @change="updateNode"
              >
                <option value="en-US">English (US)</option>
                <option value="es-ES">Spanish (ES)</option>
                <option value="fr-FR">French (FR)</option>
              </select>
            </div>
  
            <!-- Handoff Settings -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center justify-between mb-3">
                <label class="text-sm font-medium text-gray-700">HANDOFF SETTINGS</label>
              </div>
              <div class="space-y-3">
                <!-- Handoff Timeout -->
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">TIMEOUT (SECONDS)</label>
                  <input
                    type="number"
                    v-model.number="data.handoffTimeout"
                    min="0"
                    max="300"
                    class="w-full px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  />
                </div>
  
                <!-- Handoff Queue -->
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">HANDOFF QUEUE</label>
                  <select
                    v-model="data.handoffQueue"
                    class="w-full px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  >
                    <option value="">Select Queue...</option>
                    <option value="support">Support Queue</option>
                    <option value="sales">Sales Queue</option>
                    <option value="service">Customer Service</option>
                  </select>
                </div>
  
                <!-- Handoff Message -->
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">HANDOFF MESSAGE</label>
                  <textarea
                    v-model="data.handoffMessage"
                    rows="2"
                    placeholder="Message to play during handoff..."
                    class="w-full px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  ></textarea>
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
        class="w-3 h-3 !bg-indigo-500"
      />
      
      <!-- Output Handles -->
      <div class="flex justify-around mt-3">
        <div v-for="output in outputs" 
             :key="output.id" 
             class="flex flex-col items-center">
          <Handle
            type="source"
            :position="Position.Bottom"
            :id="output.id"
            class="w-3 h-3 !bg-indigo-500 cursor-pointer hover:scale-110 transition-transform"
          />
          <span 
            class="mt-1 text-xs text-gray-500 px-2 py-0.5 rounded"
            :class="output.class"
          >
            {{ output.label }}
          </span>
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
      agentId?: string
      language?: string
      handoffTimeout?: number
      handoffQueue?: string
      handoffMessage?: string
    }
    isSelected?: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update', id: string, data: any): void
  }>()
  
  // Mock virtual agents data
  const virtualAgents = [
    { id: 'va_1', name: 'Customer Support Bot' },
    { id: 'va_2', name: 'Sales Assistant' },
    { id: 'va_3', name: 'Technical Support Bot' }
  ]
  
  // Output connection points configuration
  const outputs = [
    { 
      id: 'completed', 
      label: 'Completed',
      class: 'bg-green-100 text-green-700'
    },
    { 
      id: 'handoff', 
      label: 'Live Agent Handoff',
      class: 'bg-blue-100 text-blue-700'
    },
    { 
      id: 'hangup', 
      label: 'Hangup',
      class: 'bg-yellow-100 text-yellow-700'
    },
    { 
      id: 'failed', 
      label: 'Failed',
      class: 'bg-red-100 text-red-700'
    }
  ]
  
  // Update node data
  const updateNode = () => {
    emit('update', props.id, {
      ...props.data
    })
  }
  </script>