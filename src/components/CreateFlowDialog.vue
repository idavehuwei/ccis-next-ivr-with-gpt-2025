# src/components/CreateFlowDialog.vue
<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" @click="closeDialog">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

    <!-- Dialog -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative w-full max-w-3xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
           @click.stop>
        <!-- Header -->
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-700">New Flow</h3>
          <button @click="closeDialog" class="text-gray-400 hover:text-gray-500">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <template v-if="currentStep === 1">
            <p class="text-gray-600 mb-6">
              Name your flow, and start building with Studio.
            </p>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  FLOW NAME
                </label>
                <input
                  type="text"
                  v-model="flowName"
                  placeholder="My first flow"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </template>

          <template v-else-if="currentStep === 2">
            <p class="text-gray-600 mb-6">
              Choose a template to get going, or start from scratch with a blank canvas.
            </p>

            <div class="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
              <!-- Start from scratch template -->
              <div 
                class="border rounded-lg p-4 cursor-pointer hover:border-blue-500"
                :class="{'border-blue-500 bg-blue-50': selectedTemplate === 'scratch'}"
                @click="selectedTemplate = 'scratch'"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium">Start from scratch.</h4>
                  <div v-if="selectedTemplate === 'scratch'" class="text-blue-500">
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p class="text-gray-500 text-sm mb-4">Start building from scratch.</p>
                <a href="#" class="text-blue-600 text-sm hover:text-blue-700">Step-by-Step Tutorial →</a>
              </div>

              <!-- Appointment Reminders template -->
              <div 
                class="border rounded-lg p-4 cursor-pointer hover:border-blue-500"
                :class="{'border-blue-500 bg-blue-50': selectedTemplate === 'appointment'}"
                @click="selectedTemplate = 'appointment'"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium">Appointment Reminders</h4>
                  <div v-if="selectedTemplate === 'appointment'" class="text-blue-500">
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p class="text-gray-500 text-sm mb-4">Reduce no-shows by sending confirmation messages.</p>
                <a href="#" class="text-blue-600 text-sm hover:text-blue-700">Step-by-Step Tutorial →</a>
              </div>

              <!-- IVR / Phone Tree template -->
              <div 
                class="border rounded-lg p-4 cursor-pointer hover:border-blue-500"
                :class="{'border-blue-500 bg-blue-50': selectedTemplate === 'ivr'}"
                @click="selectedTemplate = 'ivr'"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium">IVR / Phone Tree</h4>
                  <div v-if="selectedTemplate === 'ivr'" class="text-blue-500">
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p class="text-gray-500 text-sm mb-4">An interactive Voice Response (IVR) system that precisely routes each caller.</p>
                <a href="#" class="text-blue-600 text-sm hover:text-blue-700">Step-by-Step Tutorial →</a>
              </div>

              <!-- Messaging Chatbot template -->
              <div 
                class="border rounded-lg p-4 cursor-pointer hover:border-blue-500"
                :class="{'border-blue-500 bg-blue-50': selectedTemplate === 'chatbot'}"
                @click="selectedTemplate = 'chatbot'"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium">Messaging Chatbot</h4>
                  <div v-if="selectedTemplate === 'chatbot'" class="text-blue-500">
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p class="text-gray-500 text-sm mb-4">Have a conversation with your customers using both inbound and outbound SMS or WhatsApp.</p>
                <a href="#" class="text-blue-600 text-sm hover:text-blue-700">Step-by-Step Tutorial →</a>
              </div>
            </div>
          </template>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <div>
            <button 
              v-if="currentStep === 2"
              class="flex items-center text-gray-600 hover:text-gray-900"
              @click="currentStep = 1"
            >
              <svg class="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Back
            </button>
          </div>
          <div class="space-x-3">
            <button
              class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
              @click="closeDialog"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              :disabled="currentStep === 1 ? !flowName.trim() : !selectedTemplate"
              @click="handleNext"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'create', data: { name: string, template: string }): void
}>()

const router = useRouter()
const currentStep = ref(1)
const flowName = ref('')
const selectedTemplate = ref('')

const closeDialog = () => {
  emit('update:modelValue', false)
  resetDialog()
}

const resetDialog = () => {
  currentStep.value = 1
  flowName.value = ''
  selectedTemplate.value = ''
}

const handleNext = () => {
  if (currentStep.value === 1) {
    currentStep.value = 2
  } else {
    // 模拟生成一个新的流程ID
    const newFlowId = Date.now().toString()
    
    emit('create', {
      name: flowName.value,
      template: selectedTemplate.value
    })
    
    // 关闭对话框并导航到流程设计器
    closeDialog()
    router.push(`/studio/flows/${newFlowId}/edit`)
  }
}
</script>