<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" @click="closeDialog">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />

    <!-- Dialog -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative w-full max-w-3xl bg-white rounded-lg shadow-xl" @click.stop>
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 class="text-xl font-medium text-gray-900">New Flow</h3>
          <button @click="closeDialog" class="text-gray-400 hover:text-gray-500">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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
                <label class="block text-sm font-medium text-gray-700">FLOW NAME</label>
                <input
                  v-model="flowName"
                  type="text"
                  placeholder="My first flow"
                  class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </template>

          <template v-if="currentStep === 2">
            <p class="text-gray-600 mb-6">
              Choose a template to get going, or start from scratch with a blank canvas.
            </p>

            <div class="grid grid-cols-2 gap-4">
              <!-- Start from scratch -->
              <div 
                class="relative border rounded-lg p-4 cursor-pointer hover:border-blue-500"
                :class="{'border-blue-500 bg-blue-50': selectedTemplate === 'scratch'}"
                @click="selectTemplate('scratch')"
              >
                <div class="space-y-2">
                  <h4 class="font-medium">Start from scratch.</h4>
                  <p class="text-sm text-gray-500">Start building from scratch.</p>
                </div>
                <div v-if="selectedTemplate === 'scratch'" class="absolute top-4 right-4 text-blue-500">
                  <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                </div>
              </div>

              <!-- Appointment Reminders -->
              <div 
                class="relative border rounded-lg p-4 cursor-pointer hover:border-blue-500"
                :class="{'border-blue-500 bg-blue-50': selectedTemplate === 'appointment'}"
                @click="selectTemplate('appointment')"
              >
                <div class="space-y-2">
                  <h4 class="font-medium">Appointment Reminders</h4>
                  <p class="text-sm text-gray-500">Reduce no-shows by sending confirmation messages.</p>
                  <a href="#" class="text-blue-600 text-sm hover:text-blue-700">Step-by-Step Tutorial →</a>
                </div>
                <div v-if="selectedTemplate === 'appointment'" class="absolute top-4 right-4 text-blue-500">
                  <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                </div>
              </div>

              <!-- IVR / Phone Tree -->
              <div 
                class="relative border rounded-lg p-4 cursor-pointer hover:border-blue-500"
                :class="{'border-blue-500 bg-blue-50': selectedTemplate === 'ivr'}"
                @click="selectTemplate('ivr')"
              >
                <div class="space-y-2">
                  <h4 class="font-medium">IVR / Phone Tree</h4>
                  <p class="text-sm text-gray-500">An Interactive Voice Response (IVR) system that precisely routes each caller.</p>
                  <a href="#" class="text-blue-600 text-sm hover:text-blue-700">Step-by-Step Tutorial →</a>
                </div>
                <div v-if="selectedTemplate === 'ivr'" class="absolute top-4 right-4 text-blue-500">
                  <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                </div>
              </div>

              <!-- SMS Chatbot -->
              <div 
                class="relative border rounded-lg p-4 cursor-pointer hover:border-blue-500"
                :class="{'border-blue-500 bg-blue-50': selectedTemplate === 'sms'}"
                @click="selectTemplate('sms')"
              >
                <div class="space-y-2">
                  <h4 class="font-medium">SMS Chatbot</h4>
                  <p class="text-sm text-gray-500">Have a conversation with your customers using both inbound and outbound SMS.</p>
                  <a href="#" class="text-blue-600 text-sm hover:text-blue-700">Step-by-Step Tutorial →</a>
                </div>
                <div v-if="selectedTemplate === 'sms'" class="absolute top-4 right-4 text-blue-500">
                  <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                </div>
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
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" />
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
              {{ currentStep === 2 ? 'Create Flow' : 'Next' }}
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

const selectTemplate = (templateId: string) => {
  selectedTemplate.value = templateId
}

const handleNext = () => {
  if (currentStep.value === 1) {
    currentStep.value = 2
  } else {
    const newFlowId = Date.now().toString()
    
    emit('create', {
      name: flowName.value,
      template: selectedTemplate.value
    })
    
    closeDialog()
    router.push(`/studio/flows/${newFlowId}/edit`)
  }
}
</script>