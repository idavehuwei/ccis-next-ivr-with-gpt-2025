<!-- src/views/phone/TwiMLApps.vue -->
<template>
    <div class="px-8 py-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-semibold">TwiML Apps</h1>
          <p class="mt-2 text-gray-600">Manage your TwiML applications</p>
        </div>
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          @click="createNewApp"
        >
          Create New App
        </button>
      </div>
  
      <!-- Apps List -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b">
          <h2 class="font-medium">Your Applications</h2>
        </div>
        <div class="divide-y">
          <div v-if="apps.length === 0" class="p-8 text-center text-gray-500">
            No TwiML applications found. Create one to get started.
          </div>
          <div
            v-for="app in apps"
            :key="app.id"
            class="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div>
              <div class="font-medium">{{ app.name }}</div>
              <div class="text-sm text-gray-500">{{ app.sid }}</div>
            </div>
            <div class="flex items-center space-x-4">
              <button class="text-blue-600 hover:text-blue-700">Edit</button>
              <button class="text-red-600 hover:text-red-700">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const apps = ref([
    {
      id: 1,
      name: 'Customer Support IVR',
      sid: 'AP1234567890abcdef'
    },
    {
      id: 2,
      name: 'Sales Line',
      sid: 'AP2345678901bcdefg'
    }
  ])
  
  const createNewApp = () => {
    // Implement create new app logic
    console.log('Creating new TwiML app')
  }
  </script>