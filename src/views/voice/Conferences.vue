<!-- src/views/voice/Conferences.vue -->
<template>
    <div class="px-8 py-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-semibold">Conferences</h1>
          <p class="mt-2 text-gray-600">Manage your conference calls</p>
        </div>
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Conference
        </button>
      </div>
  
      <!-- Active Conferences -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="p-4 border-b">
          <h2 class="font-medium">Active Conferences</h2>
        </div>
        <div class="divide-y">
          <div v-if="activeConferences.length === 0" class="p-8 text-center text-gray-500">
            No active conferences at the moment.
          </div>
          <div
            v-for="conference in activeConferences"
            :key="conference.id"
            class="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div>
              <div class="font-medium">{{ conference.name }}</div>
              <div class="text-sm text-gray-500">
                {{ conference.participants }} participants · Started {{ conference.startTime }}
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <button class="text-blue-600 hover:text-blue-700">Join</button>
              <button class="text-red-600 hover:text-red-700">End</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Past Conferences -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b">
          <h2 class="font-medium">Past Conferences</h2>
        </div>
        <div class="divide-y">
          <div
            v-for="conference in pastConferences"
            :key="conference.id"
            class="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div>
              <div class="font-medium">{{ conference.name }}</div>
              <div class="text-sm text-gray-500">
                {{ conference.participants }} participants · Duration: {{ conference.duration }}
              </div>
              <div class="text-xs text-gray-400">{{ conference.date }}</div>
            </div>
            <div class="flex items-center space-x-4">
              <button class="text-blue-600 hover:text-blue-700">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const activeConferences = ref([
    {
      id: 1,
      name: 'Team Meeting',
      participants: 5,
      startTime: '10 minutes ago'
    },
    {
      id: 2,
      name: 'Client Call',
      participants: 3,
      startTime: '5 minutes ago'
    }
  ])
  
  const pastConferences = ref([
    {
      id: 3,
      name: 'Weekly Standup',
      participants: 8,
      duration: '45 minutes',
      date: 'March 20, 2024'
    },
    {
      id: 4,
      name: 'Product Demo',
      participants: 12,
      duration: '1 hour',
      date: 'March 19, 2024'
    }
  ])
  </script>