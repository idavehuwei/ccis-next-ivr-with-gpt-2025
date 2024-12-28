<!-- src/components/TemplateLoader.vue -->
<template>
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="closeDialog" class="relative z-50">
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/30" />
        </TransitionChild>
  
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium text-gray-900">
                  Load Flow Template
                </DialogTitle>
  
                <!-- Template List -->
                <div class="mt-4">
                  <div class="space-y-4">
                    <div v-for="template in templates" 
                         :key="template.name"
                         class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                         :class="{ 'border-blue-500 bg-blue-50': template === selectedTemplate }"
                         @click="selectTemplate(template)"
                    >
                      <div class="flex justify-between items-start">
                        <div>
                          <h4 class="font-medium">{{ template.name }}</h4>
                          <p class="text-sm text-gray-500 mt-1">{{ template.description }}</p>
                        </div>
                        <div v-if="template === selectedTemplate" class="text-blue-500">
                          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- Actions -->
                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    @click="closeDialog"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="!selectedTemplate"
                    @click="loadSelectedTemplate"
                  >
                    Load Template
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
  } from '@headlessui/vue'
  import { availableTemplates } from '../templates/chatbot-basic'
  
  const props = defineProps<{
    isOpen: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'load', template: any): void
  }>()
  
  const templates = availableTemplates
  const selectedTemplate = ref(null)
  
  const selectTemplate = (template: any) => {
    selectedTemplate.value = template
  }
  
  const loadSelectedTemplate = () => {
    if (selectedTemplate.value) {
      emit('load', selectedTemplate.value)
      closeDialog()
    }
  }
  
  const closeDialog = () => {
    selectedTemplate.value = null
    emit('close')
  }
  </script>