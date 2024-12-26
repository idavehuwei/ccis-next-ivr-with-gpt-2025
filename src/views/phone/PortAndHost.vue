# src/views/phone/PortAndHost.vue
<template>
  <div class="px-8 py-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold">Port & Host Numbers</h1>
        <p class="mt-2 text-gray-600">Transfer your existing phone numbers to our platform.</p>
      </div>
      <button 
        @click="startNewPort"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Start New Port
      </button>
    </div>

    <!-- Porting Process Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex items-start">
          <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">1</div>
          <div>
            <h3 class="font-medium mb-2">Submit Request</h3>
            <p class="text-gray-600 text-sm">Fill out our porting form with your current carrier information.</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex items-start">
          <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">2</div>
          <div>
            <h3 class="font-medium mb-2">Review & Approve</h3>
            <p class="text-gray-600 text-sm">We'll review your request and prepare the transfer.</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex items-start">
          <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">3</div>
          <div>
            <h3 class="font-medium mb-2">Complete Transfer</h3>
            <p class="text-gray-600 text-sm">Once approved, we'll coordinate the transfer with your carrier.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Port Requests -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="font-medium">Active Port Requests</h2>
        <div class="text-sm text-gray-500">
          Showing {{ portRequests.length }} requests
        </div>
      </div>

      <div class="divide-y">
        <div v-if="portRequests.length === 0" class="p-8 text-center text-gray-500">
          No active port requests found.
        </div>
        
        <div
          v-for="request in portRequests"
          :key="request.id"
          class="p-4 flex items-center justify-between hover:bg-gray-50"
        >
          <div>
            <div class="font-medium">{{ request.phoneNumber }}</div>
            <div class="text-sm text-gray-500">
              Submitted {{ request.submittedDate }}
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div 
              class="px-2 py-1 text-sm rounded-full"
              :class="{
                'bg-yellow-100 text-yellow-700': request.status === 'pending',
                'bg-green-100 text-green-700': request.status === 'approved',
                'bg-blue-100 text-blue-700': request.status === 'in_progress'
              }"
            >
              {{ formatStatus(request.status) }}
            </div>
            <button class="text-blue-600 hover:text-blue-700">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface PortRequest {
  id: number
  phoneNumber: string
  submittedDate: string
  status: 'pending' | 'approved' | 'in_progress'
}

const portRequests = ref<PortRequest[]>([
  {
    id: 1,
    phoneNumber: '+1 (555) 123-4567',
    submittedDate: '2024-03-20',
    status: 'pending'
  },
  {
    id: 2,
    phoneNumber: '+1 (555) 234-5678',
    submittedDate: '2024-03-19',
    status: 'approved'
  },
  {
    id: 3,
    phoneNumber: '+1 (555) 345-6789',
    submittedDate: '2024-03-18',
    status: 'in_progress'
  }
])

const formatStatus = (status: string) => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const startNewPort = () => {
  // Implement new port request logic
  console.log('Starting new port request')
}
</script>