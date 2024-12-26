<!-- src/components/functions/CreateServiceDialog.vue -->
<template>
    <TransitionRoot appear :show="modelValue" as="template">
      <Dialog as="div" @close="closeDialog" class="relative z-50">
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
                <DialogTitle as="h3" class="text-xl font-medium text-gray-900 mb-4">
                  Name your Service
                </DialogTitle>
  
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    v-model="serviceName"
                    placeholder="exploration"
                    class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
                  />
                  <p class="mt-2 text-sm text-gray-500">
                    This URL-friendly unique name will form the first part of your Serverless domain and cannot be updated.
                  </p>
  
                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-500 mb-1">
                      URL:
                    </label>
                    <div class="text-sm text-gray-700">
                      {{ generatedUrl }}
                    </div>
                  </div>
                </div>
  
                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    @click="closeDialog"
                    class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    @click="handleNext"
                    class="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    :disabled="!isValidName"
                  >
                    Next
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
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
  } from '@headlessui/vue'
  
  const props = defineProps<{
    modelValue: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
  }>()
  
  const router = useRouter()
  const serviceName = ref('')
  
  const generatedUrl = computed(() => {
    return serviceName.value ? 
      `${serviceName.value}-[auto-generated-numbers].twil.io` : 
      '[service-name]-[auto-generated-numbers].twil.io'
  })
  
  const isValidName = computed(() => {
    return /^[a-z0-9-]+$/.test(serviceName.value) && serviceName.value.length > 0
  })
  
  const closeDialog = () => {
    emit('update:modelValue', false)
    serviceName.value = ''
  }
  
  const handleNext = () => {
    if (!isValidName.value) return
    
    // 生成一个随机数作为服务 ID
    const serviceId = Math.floor(Math.random() * 10000)
    const fullServiceName = `${serviceName.value}-${serviceId}`
    
    closeDialog()
    router.push(`/functions/${fullServiceName}/editor`)
  }
  </script>