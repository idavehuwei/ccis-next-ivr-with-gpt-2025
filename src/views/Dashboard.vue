# src/views/Dashboard.vue
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-medium">CCIS Next IVR Dashboard</h1>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input
                type="search"
                placeholder="Search flows..."
                class="w-64 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span class="absolute right-3 top-2.5 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
            <button class="p-2 hover:bg-gray-100 rounded-full" title="Settings">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="stat in stats" :key="stat.name" 
             class="bg-white p-6 rounded-lg shadow-sm">
          <div class="text-sm font-medium text-gray-500">{{ stat.name }}</div>
          <div class="mt-2 flex items-baseline">
            <div class="text-2xl font-semibold">{{ stat.value }}</div>
            <div :class="[
              'ml-2 text-sm',
              stat.change >= 0 ? 'text-green-600' : 'text-red-600'
            ]">
              {{ stat.change >= 0 ? '+' : '' }}{{ stat.change }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions and Recent Flows -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Quick Actions -->
        <div class="lg:col-span-1">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h2 class="text-lg font-medium mb-4">Quick Actions</h2>
            <div class="space-y-3">
              <button v-for="action in quickActions" :key="action.name"
                      class="w-full flex items-center px-4 py-2 text-left text-sm rounded-md hover:bg-gray-50">
                <span class="text-gray-500" v-html="action.icon"></span>
                <span class="ml-3">{{ action.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Flows -->
        <div class="lg:col-span-2">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium">Recent IVR Flows</h2>
              <button class="text-sm text-blue-600 hover:text-blue-700">View all</button>
            </div>
            <div class="space-y-4">
              <div v-for="flow in recentFlows" :key="flow.id"
                   class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-md">
                <div>
                  <div class="font-medium">{{ flow.name }}</div>
                  <div class="text-sm text-gray-500">Last modified {{ flow.lastModified }}</div>
                </div>
                <div class="flex space-x-2">
                  <button class="p-2 text-gray-400 hover:text-gray-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button class="p-2 text-gray-400 hover:text-gray-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Widget Library -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-lg font-medium mb-4">Widget Library</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="widget in widgets" :key="widget.name"
               class="p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
            <div class="font-medium">{{ widget.name }}</div>
            <div class="text-sm text-gray-500 mt-1">{{ widget.description }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { name: 'Total Flows', value: '48', change: 12 },
  { name: 'Active Calls', value: '256', change: -2 },
  { name: 'Success Rate', value: '98.5%', change: 3 },
  { name: 'Avg Response Time', value: '1.2s', change: 5 }
]

const quickActions = [
  { 
    name: 'Create New Flow',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>'
  },
  {
    name: 'Import Flow',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>'
  },
  {
    name: 'View Analytics',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>'
  }
]

const recentFlows = [
  { id: 1, name: 'Customer Support Flow', lastModified: '2 hours ago' },
  { id: 2, name: 'Sales Inquiry Handler', lastModified: '5 hours ago' },
  { id: 3, name: 'Appointment Scheduler', lastModified: '1 day ago' }
]

const widgets = [
  { name: 'Split Based On...', description: 'Create conditional branches in your flow' },
  { name: 'Send Message', description: 'Send automated messages to callers' },
  { name: 'Send & Wait for Reply', description: 'Interactive response handling' },
  { name: 'Say/Play', description: 'Play audio messages or text-to-speech' },
  { name: 'Gather Input on Call', description: 'Collect user input during calls' },
  { name: 'Connect Call To', description: 'Transfer calls to specific destinations' },
  { name: 'Record Voicemail', description: 'Enable voicemail recording' },
  { name: 'Make Outgoing Call', description: 'Initiate outbound calls' }
]
</script>