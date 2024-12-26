<!-- src/views/studio/FlowTemplates.vue -->
<template>
    <div class="px-8 py-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-semibold">Flow Templates</h1>
          <p class="mt-2 text-gray-600">Get started quickly with pre-built flow templates</p>
        </div>
      </div>
  
      <!-- Templates Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="template in templates" :key="template.id" 
             class="bg-white rounded-lg shadow-sm border hover:border-blue-500 cursor-pointer">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-medium">{{ template.name }}</h3>
              <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                {{ template.category }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-4">{{ template.description }}</p>
            <div class="flex justify-between items-center">
              <button class="text-blue-600 hover:text-blue-700 text-sm">
                Learn More
              </button>
              <button class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Use Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const templates = ref([
    {
      id: 1,
      name: 'IVR Menu',
      category: 'Voice',
      description: 'Basic interactive voice response menu with multiple options'
    },
    {
      id: 2,
      name: 'Appointment Reminders',
      category: 'Messaging',
      description: 'Send automated appointment reminders with confirmation'
    },
    {
      id: 3,
      name: 'Customer Survey',
      category: 'Voice',
      description: 'Collect customer feedback through automated surveys'
    },
    {
      id: 4,
      name: 'Order Status',
      category: 'Messaging',
      description: 'Send order status updates and tracking information'
    }
  ])
  </script>