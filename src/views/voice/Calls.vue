<!-- src/views/voice/Calls.vue -->
<template>
    <div class="px-8 py-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-semibold">Call Logs</h1>
          <p class="mt-2 text-gray-600">View and manage your call history</p>
        </div>
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Make a Call
        </button>
      </div>
  
      <!-- Calls List -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b flex justify-between items-center">
          <h2 class="font-medium">Recent Calls</h2>
          <div class="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search calls..."
              class="px-3 py-1 border rounded-md text-sm"
            />
            <select class="px-3 py-1 border rounded-md text-sm">
              <option value="all">All Types</option>
              <option value="incoming">Incoming</option>
              <option value="outgoing">Outgoing</option>
            </select>
          </div>
        </div>
        <div class="divide-y">
          <div
            v-for="call in calls"
            :key="call.id"
            class="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div>
              <div class="font-medium">{{ call.number }}</div>
              <div class="text-sm text-gray-500">
                {{ call.direction }} · Duration: {{ call.duration }}
              </div>
              <div class="text-xs text-gray-400">{{ call.time }}</div>
            </div>
            <div class="flex items-center space-x-4">
              <div 
                class="px-2 py-1 rounded-full text-xs"
                :class="{
                  'bg-green-100 text-green-700': call.status === 'completed',
                  'bg-yellow-100 text-yellow-700': call.status === 'in-progress',
                  'bg-red-100 text-red-700': call.status === 'failed'
                }"
              >
                {{ call.status }}
              </div>
              <button class="text-blue-600 hover:text-blue-700">View</button>
            </div>
          </div>
        </div>
        <!-- Pagination -->
        <div class="p-4 border-t flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Showing 1-10 of 50 calls
          </div>
          <div class="flex space-x-2">
            <button class="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
            <button class="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const calls = ref([
    {
      id: 1,
      number: '+1 (555) 123-4567',
      direction: 'Incoming',
      duration: '5:23',
      time: '5 minutes ago',
      status: 'completed'
    },
    {
      id: 2,
      number: '+1 (555) 234-5678',
      direction: 'Outgoing',
      duration: '2:15',
      time: '30 minutes ago',
      status: 'completed'
    },
    {
      id: 3,
      number: '+1 (555) 345-6789',
      direction: 'Incoming',
      duration: '0:45',
      time: '1 hour ago',
      status: 'failed'
    }
  ])
  </script>