<!-- src/views/phone/PortRequestDetail.vue -->
<template>
    <div class="px-8 py-6">
      <div class="mb-6">
        <div class="text-sm text-blue-600 mb-2">
          <router-link to="/phone-numbers/port">&larr; Back to Port Requests</router-link>
        </div>
        <h1 class="text-2xl font-semibold">Port Request Details</h1>
      </div>
  
      <!-- Request Details -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="p-4 border-b">
          <h2 class="font-medium">Request Information</h2>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <div class="text-sm text-gray-500 mb-1">REQUEST ID</div>
              <div class="font-mono">PR1234567890</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">STATUS</div>
              <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                In Progress
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">SUBMITTED ON</div>
              <div>March 20, 2024</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">NUMBERS</div>
              <div>+1 (555) 123-4567</div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Status Timeline -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b">
          <h2 class="font-medium">Status Timeline</h2>
        </div>
        <div class="p-4">
          <div class="space-y-6">
            <div v-for="(event, index) in timeline" :key="index">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span class="text-blue-600 text-lg">{{ index + 1 }}</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="font-medium">{{ event.title }}</div>
                  <div class="text-sm text-gray-500">{{ event.time }}</div>
                  <div class="mt-1 text-sm">{{ event.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const timeline = ref([
    {
      title: 'Request Submitted',
      time: 'March 20, 2024 10:30 AM',
      description: 'Port request submitted successfully'
    },
    {
      title: 'Documentation Review',
      time: 'March 20, 2024 2:45 PM',
      description: 'Required documentation under review'
    },
    {
      title: 'Carrier Verification',
      time: 'March 21, 2024 9:15 AM',
      description: 'Current carrier verifying information'
    }
  ])
  </script>