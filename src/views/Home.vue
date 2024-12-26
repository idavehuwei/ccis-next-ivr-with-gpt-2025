<!-- src/views/Home.vue -->
<template>
    <div class="flex-1 bg-gray-100 px-8 py-6">
      <!-- Project Info Section -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-2xl font-normal text-gray-700 mb-4">Project Info</h2>
              <p class="text-gray-600 mb-2">
                We've customized your IVR dashboard based on your settings. Use the widget library to start building your flow.
              </p>
              <p class="text-gray-600">We can't wait to see what you build!</p>
            </div>
            <div class="w-96">
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-500">PROJECT NAME</span>
                  <div class="flex items-center">
                    <span class="text-gray-700">CCIS Next IVR</span>
                    <button class="ml-2 text-blue-600 hover:text-blue-700">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500">ACCOUNT SID</span>
                  <span class="text-gray-700 font-mono text-sm">IVR4e698cd1194fddbacb87b51c6ea030b5</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500">ACTIVE FLOWS</span>
                  <span class="text-gray-700">0</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500">API STATUS</span>
                  <span class="text-green-600">Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Quick Access Sections Grid -->
      <div class="grid grid-cols-2 gap-6">
        <!-- What's New Section -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6">
            <div class="flex items-center space-x-2 mb-4">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h2 class="text-lg font-medium text-gray-700">What's New</h2>
            </div>
            <p class="text-gray-600 mb-4">Check out our latest IVR features and improvements in the changelog.</p>
            <button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Changelog
            </button>
          </div>
        </div>
  
        <!-- Start Building Section -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-6">
            <div class="flex items-center space-x-2 mb-4">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h2 class="text-lg font-medium text-gray-700">Start Building</h2>
            </div>
            <p class="text-gray-600 mb-4">Create your first IVR flow using our widget library.</p>
            <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Create New Flow
            </button>
          </div>
        </div>
      </div>
  
      <!-- Widget Library Section -->
      <div class="mt-6 bg-white rounded-lg shadow-sm">
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-700 mb-4">Widget Library</h2>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="widget in widgets" :key="widget.name"
                 class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <div class="font-medium text-gray-700">{{ widget.name }}</div>
              <div class="text-sm text-gray-500 mt-1">Drag to add to your flow</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const widgets = [
    { name: 'Split Based On...' },
    { name: 'Send Message' },
    { name: 'Send & Wait for Reply' },
    { name: 'Say/Play' },
    { name: 'Gather Input on Call' },
    { name: 'Connect Call To' },
    { name: 'Record Voicemail' },
    { name: 'Make Outgoing Call' }
  ]
  </script>
  
  <style scoped>
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  </style>