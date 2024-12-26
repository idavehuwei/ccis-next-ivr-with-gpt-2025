# src/views/voice/Voice.vue
<template>
  <div class="px-8 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Voice</h1>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Make a Call
      </button>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-sm font-medium text-gray-500">Total Calls (24h)</h3>
        <div class="mt-2 flex items-center">
          <span class="text-2xl font-semibold">328</span>
          <span class="ml-2 text-sm text-green-600">+5.2%</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-sm font-medium text-gray-500">Avg. Call Duration</h3>
        <div class="mt-2 flex items-center">
          <span class="text-2xl font-semibold">4:32</span>
          <span class="ml-2 text-sm text-gray-500">minutes</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-sm font-medium text-gray-500">Success Rate</h3>
        <div class="mt-2 flex items-center">
          <span class="text-2xl font-semibold">97.8%</span>
          <span class="ml-2 text-sm text-green-600">+0.3%</span>
        </div>
      </div>
    </div>

    <!-- Recent Calls -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="font-medium">Recent Calls</h2>
        <button class="text-sm text-blue-600 hover:text-blue-700">View All</button>
      </div>
      <div class="p-4">
        <div v-for="call in recentCalls" :key="call.id"
             class="flex items-center justify-between py-3 border-b last:border-0">
          <div>
            <div class="font-medium">{{ call.number }}</div>
            <div class="text-sm text-gray-500">
              Duration: {{ call.duration }} • {{ call.direction }}
            </div>
            <div class="text-xs text-gray-400">{{ call.time }}</div>
          </div>
          <div :class="[
            'px-2 py-1 rounded text-xs',
            call.status === 'completed' ? 'bg-green-100 text-green-700' : 
            call.status === 'failed' ? 'bg-red-100 text-red-700' : 
            'bg-yellow-100 text-yellow-700'
          ]">
            {{ call.status }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const recentCalls = [
  {
    id: 1,
    number: '+1 (555) 123-4567',
    duration: '5:23',
    direction: 'Inbound',
    time: '5 minutes ago',
    status: 'completed'
  },
  {
    id: 2,
    number: '+1 (555) 234-5678',
    duration: '3:12',
    direction: 'Outbound',
    time: '30 minutes ago',
    status: 'completed'
  },
  {
    id: 3,
    number: '+1 (555) 345-6789',
    duration: '0:45',
    direction: 'Inbound',
    time: '1 hour ago',
    status: 'failed'
  }
]
</script>