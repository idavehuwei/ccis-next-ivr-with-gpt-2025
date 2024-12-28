<template>
    <div class="bg-white rounded-lg shadow-sm p-4" :class="[isSelected ? 'ring-2 ring-blue-500' : '']">
      <div class="send-message-content">
        <label for="message" class="block text-sm font-medium text-gray-700">Message:</label>
        <textarea id="message" rows="4" class="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Type your message here..."></textarea>
        <button @click="sendMessage" class="mt-3 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Send</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    isSelected?: boolean
  }>()
  
  function sendMessage() {
    console.log('Message sent');
  }
  </script>
  
  <style scoped>
  .send-message-content {
    padding: 10px;
  }
  </style>