<!-- src/views/messaging/Messaging.vue -->
<template>
    <div class="px-8 py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold">Messaging</h1>
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Send New Message
        </button>
      </div>
      
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-sm font-medium text-gray-500">Messages Sent (30d)</h3>
          <div class="mt-2 flex items-center">
            <span class="text-2xl font-semibold">1,234</span>
            <span class="ml-2 text-sm text-green-600">+12.3%</span>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-sm font-medium text-gray-500">Delivery Rate</h3>
          <div class="mt-2 flex items-center">
            <span class="text-2xl font-semibold">98.7%</span>
            <span class="ml-2 text-sm text-green-600">+0.5%</span>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-sm font-medium text-gray-500">Active Numbers</h3>
          <div class="mt-2 flex items-center">
            <span class="text-2xl font-semibold">3</span>
            <span class="ml-2 text-sm text-gray-500">of 5 total</span>
          </div>
        </div>
      </div>
  
      <!-- Recent Messages -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b flex justify-between items-center">
          <h2 class="font-medium">Recent Messages</h2>
          <button class="text-sm text-blue-600 hover:text-blue-700">View All</button>
        </div>
        <div class="p-4">
          <div v-for="message in recentMessages" :key="message.id"
               class="flex items-center justify-between py-3 border-b last:border-0">
            <div>
              <div class="font-medium">{{ message.to }}</div>
              <div class="text-sm text-gray-500">{{ message.content }}</div>
              <div class="text-xs text-gray-400">{{ message.time }}</div>
            </div>
            <div :class="[
              'px-2 py-1 rounded-full text-xs',
              message.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
              message.status === 'Failed' ? 'bg-red-100 text-red-700' : 
              'bg-yellow-100 text-yellow-700'
            ]">
              {{ message.status }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const recentMessages = [
    {
      id: 1,
      to: '+1 (555) 123-4567',
      content: 'Your appointment is confirmed for tomorrow at 2 PM',
      time: '5 minutes ago',
      status: 'Delivered'
    },
    {
      id: 2,
      to: '+1 (555) 234-5678',
      content: 'Your order #12345 has been shipped',
      time: '1 hour ago',
      status: 'Pending'
    },
    {
      id: 3,
      to: '+1 (555) 345-6789',
      content: 'Thank you for your purchase',
      time: '2 hours ago',
      status: 'Failed'
    }
  ]
  </script>