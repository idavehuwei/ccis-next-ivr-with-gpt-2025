<!-- src/components/functions/FunctionEditor.vue -->
<template>
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Function Header -->
      <div class="px-4 py-2 bg-white border-b flex items-center space-x-2">
        <div class="flex items-center text-gray-600 space-x-2">
          <div class="w-2 h-2 rounded-full bg-gray-400"></div>
          <span class="text-sm">/auto-responder</span>
        </div>
        <button class="text-gray-600 hover:text-gray-800 px-2 py-1 text-sm">Protected</button>
        <button class="text-gray-400">
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
        <!-- Close button -->
        <button class="ml-auto text-gray-400 hover:text-gray-600">×</button>
        <!-- Full screen button -->
        <button class="text-gray-400 hover:text-gray-600">
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zM17 16a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 012 0v4z"/>
          </svg>
        </button>
      </div>
  
      <!-- Code Editor -->
      <div class="flex-1 overflow-auto bg-white">
        <div class="relative">
          <!-- Line Numbers -->
          <div class="absolute left-0 top-0 bottom-0 w-12 bg-gray-50 border-r text-right pr-2 pt-4 text-gray-400 select-none">
            {/* 代码行号 1-18 */}
            <div v-for="i in 18" :key="i" class="leading-6">{{ i }}</div>
          </div>
          
          <!-- Code Content -->
          <pre class="pl-16 pt-4 text-sm font-mono leading-6">
  <span class="text-green-600">// This is your new function. To start, set the name and path on the left.</span>
  
  exports.handler = <span class="text-purple-600">function</span>(context, event, callback) {
    <span class="text-green-600">// Here's an example of setting up some TwiML to respond to with this function</span>
    <span class="text-purple-600">let</span> twiml = <span class="text-purple-600">new</span> Twilio.twiml.VoiceResponse();
    twiml.say(<span class="text-red-600">'Hello World'</span>);
  
    <span class="text-purple-600">let</span> variable = <span class="text-red-600">'welcome!'</span>;
  
    <span class="text-green-600">// You can log with console.log</span>
    console.log(<span class="text-red-600">'error'</span>, variable);
  
    <span class="text-green-600">// This callback is what is returned in response to this function being invoked.</span>
    <span class="text-green-600">// It's really important! E.g. you might respond with TwiML here for a voice or SMS response.</span>
    <span class="text-green-600">// Or you might return JSON data to a studio flow. Don't forget it!</span>
    <span class="text-purple-600">return</span> callback(<span class="text-purple-600">null</span>, twiml);
  };</pre>
        </div>
      </div>
  
      <!-- Action Buttons -->
      <div class="px-4 py-2 bg-gray-50 border-t flex justify-between items-center">
        <div class="flex space-x-2">
          <button class="px-4 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            Save
          </button>
          <button class="px-4 py-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
            Cancel
          </button>
          <button class="text-blue-600 hover:text-blue-700 px-4">Copy URL</button>
        </div>
        <div class="flex items-center space-x-4 text-sm text-gray-500">
          <span>javascript</span>
          <span>Ln - Col -</span>
        </div>
      </div>
  
      <!-- Logs Panel -->
      <div class="h-48 bg-gray-100">
        <div class="flex items-center justify-between px-4 py-2 bg-gray-200 border-y">
          <div class="grid grid-cols-2 gap-8 text-sm text-gray-600">
            <span>DATE & TIME</span>
            <span>MESSAGE</span>
          </div>
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2 text-sm">
              <span>Enable live logs</span>
              <div class="relative inline-block w-10 h-5">
                <input type="checkbox" class="sr-only peer" />
                <div class="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-600"></div>
                <div class="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-full"></div>
              </div>
            </label>
            <button class="text-red-600 hover:text-red-700 text-sm">Clear</button>
          </div>
        </div>
  
        <div class="p-4">
          <div v-for="log in logs" :key="log.time" class="flex space-x-16 text-sm">
            <span class="text-gray-500 w-48">{{ log.time }}</span>
            <span :class="{'text-blue-600': log.type === 'info', 'text-green-600': log.type === 'success'}">
              {{ log.message }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const logs = ref([
    {
      time: '2021-09-28 22:55:28 UTC',
      type: 'info',
      message: 'Creating function for /auto-responder'
    },
    {
      time: '2021-09-28 22:55:28 UTC',
      type: 'success',
      message: 'Function /auto-responder created'
    }
  ])
  </script>
  
  <style scoped>
  /* 自定义滚动条样式 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  </style>