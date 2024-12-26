<!-- src/views/messaging/Messages.vue -->
<template>
    <div class="px-8 py-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-semibold">Messages</h1>
          <p class="mt-2 text-gray-600">View and manage your messages</p>
        </div>
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send New Message
        </button>
      </div>
  
      <!-- Messages List -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b flex justify-between items-center">
          <h2 class="font-medium">Recent Messages</h2>
          <div class="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search messages..."
              class="px-3 py-1 border rounded-md text-sm"
            />
            <select class="px-3 py-1 border rounded-md text-sm">
              <option value="all">All Types</option>
              <option value="sms">SMS</option>
              <option value="mms">MMS</option>
            </select>
          </div>
        </div>
        <div class="divide-y">
          <div
            v-for="message in messages"
            :key="message.id"
            class="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div>
              <div class="font-medium">{{ message.to }}</div>
              <div class="text-sm text-gray-500">{{ message.content }}</div>
              <div class="text-xs text-gray-400">{{ message.time }}</div>
            </div>
            <div class="flex items-center space-x-4">
              <div 
                class="px-2 py-1 rounded-full text-xs"
                :class="{
                  'bg-green-100 text-green-700': message.status === 'delivered',
                  'bg-yellow-100 text-yellow-700': message.status === 'sending',
                  'bg-red-100 text-red-700': message.status === 'failed'
                }"
              >
                {{ message.status }}
              </div>
              <button class="text-blue-600 hover:text-blue-700">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const messages = ref([
    {
      id: 1,
      to: '+1 (555) 123-4567',
      content: 'Your appointment is confirmed for tomorrow at 2 PM',
      time: '5 minutes ago',
      status: 'delivered'
    },
    {
      id: 2,
      to: '+1 (555) 234-5678',
      content: 'Your order has been shipped',
      time: '1 hour ago',
      status: 'sending'
    },
    {
      id: 3,
      to: '+1 (555) 345-6789',
      content: 'Thank you for your purchase',
      time: '2 hours ago',
      status: 'failed'
    }
  ])
  </script>