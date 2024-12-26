# src/views/phone/VerifiedCallerIds.vue
<template>
  <div class="px-8 py-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold">Verified Caller IDs</h1>
        <p class="mt-2 text-gray-600">Manage your verified outbound caller IDs.</p>
      </div>
      <button 
        @click="showVerifyModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Verify New Number
      </button>
    </div>

    <!-- Verified Numbers List -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="font-medium">Verified Numbers</h2>
        <div class="text-sm text-gray-500">
          {{ verifiedNumbers.length }} numbers verified
        </div>
      </div>
      
      <div class="divide-y">
        <div v-if="verifiedNumbers.length === 0" class="p-8 text-center text-gray-500">
          No verified caller IDs found. Add a new one to get started.
        </div>
        
        <div
          v-for="number in verifiedNumbers"
          :key="number.id"
          class="flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <div>
            <div class="font-medium">{{ number.phoneNumber }}</div>
            <div class="text-sm text-gray-500">
              Verified on {{ number.verifiedDate }}
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="px-2 py-1 text-sm rounded-full bg-green-100 text-green-700">
              Verified
            </div>
            <button 
              @click="showRemoveConfirm(number)"
              class="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Verify New Number Modal -->
    <TransitionRoot appear :show="showVerifyModal" as="template">
      <Dialog as="div" @close="showVerifyModal = false" class="relative z-50">
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
                <DialogTitle as="h3" class="text-lg font-medium text-gray-900">
                  Verify New Caller ID
                </DialogTitle>

                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    v-model="newNumber"
                    placeholder="+1 (555) 123-4567"
                    class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
                  />
                  <p class="mt-2 text-sm text-gray-500">
                    Enter the phone number you want to verify as a caller ID.
                  </p>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    @click="showVerifyModal = false"
                    class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    @click="startVerification"
                    class="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    :disabled="!isValidPhoneNumber"
                  >
                    Start Verification
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Remove Confirmation Modal -->
    <TransitionRoot appear :show="showRemoveModal" as="template">
      <Dialog as="div" @close="showRemoveModal = false" class="relative z-50">
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
                <DialogTitle as="h3" class="text-lg font-medium text-gray-900">
                  Remove Verified Caller ID
                </DialogTitle>

                <div class="mt-4">
                  <p class="text-gray-600">
                    Are you sure you want to remove this verified caller ID? This action cannot be undone.
                  </p>
                  <div class="mt-2 p-3 bg-gray-50 rounded-md">
                    <span class="font-medium">{{ selectedNumber?.phoneNumber }}</span>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    @click="showRemoveModal = false"
                    class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    @click="confirmRemove"
                    class="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

interface VerifiedNumber {
  id: number
  phoneNumber: string
  verifiedDate: string
}

const verifiedNumbers = ref<VerifiedNumber[]>([
  {
    id: 1,
    phoneNumber: '+1 (555) 123-4567',
    verifiedDate: '2024-03-15'
  },
  {
    id: 2,
    phoneNumber: '+1 (555) 234-5678',
    verifiedDate: '2024-03-10'
  }
])

const showVerifyModal = ref(false)
const showRemoveModal = ref(false)
const newNumber = ref('')
const selectedNumber = ref<VerifiedNumber | null>(null)

// Phone number validation
const isValidPhoneNumber = computed(() => {
  // Simple validation - you might want to use a proper phone validation library
  return /^\+1 \(\d{3}\) \d{3}-\d{4}$/.test(newNumber.value)
})

const startVerification = () => {
  // Implement verification logic
  console.log('Starting verification for:', newNumber.value)
  showVerifyModal.value = false
  newNumber.value = ''
}

const showRemoveConfirm = (number: VerifiedNumber) => {
  selectedNumber.value = number
  showRemoveModal.value = true
}

const confirmRemove = () => {
  if (selectedNumber.value) {
    verifiedNumbers.value = verifiedNumbers.value.filter(
      n => n.id !== selectedNumber.value?.id
    )
  }
  showRemoveModal.value = false
  selectedNumber.value = null
}
</script>