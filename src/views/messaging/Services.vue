<!-- src/views/messaging/Services.vue -->
<template>
    <div class="px-8 py-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-semibold">Messaging Services</h1>
          <p class="mt-2 text-gray-600">Manage your messaging services and configurations</p>
        </div>
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          @click="createService"
        >
          Create New Service
        </button>
      </div>
  
      <!-- Services List -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b">
          <h2 class="font-medium">Active Services</h2>
        </div>
        <div class="divide-y">
          <div v-if="services.length === 0" class="p-8 text-center text-gray-500">
            No messaging services found. Create one to get started.
          </div>
          <div
            v-for="service in services"
            :key="service.id"
            class="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div>
              <div class="font-medium">{{ service.name }}</div>
              <div class="text-sm text-gray-500">{{ service.sid }}</div>
              <div class="text-xs text-gray-400">Created {{ service.createdAt }}</div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-500">
                {{ service.numbers }} numbers
              </div>
              <button class="text-blue-600 hover:text-blue-700">Configure</button>
              <button class="text-red-600 hover:text-red-700">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const services = ref([
    {
      id: 1,
      name: 'Customer Notifications',
      sid: 'MG1234567890abcdef',
      numbers: 3,
      createdAt: 'March 15, 2024'
    },
    {
      id: 2,
      name: 'Marketing Campaigns',
      sid: 'MG2345678901bcdefg',
      numbers: 2,
      createdAt: 'March 10, 2024'
    }
  ])
  
  const createService = () => {
    // Implement create service logic
    console.log('Creating new messaging service')
  }
  </script>