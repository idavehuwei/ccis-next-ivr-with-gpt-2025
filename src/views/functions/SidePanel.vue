<!-- src/components/functions/SidePanel.vue -->
<template>
    <div class="w-60 border-r bg-white">
      <!-- 返回按钮 -->
      <div class="p-4 flex items-center text-blue-600">
        <svg class="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        <span>{{ serviceName }}</span>
      </div>
  
      <!-- Functions Section -->
      <div class="border-b">
        <div class="flex items-center justify-between p-4 bg-gray-50 cursor-pointer" @click="toggleFunctions">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" :class="{ 'transform rotate-90': showFunctions }" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 4.293a1 1 0 011.414 0L14.414 10l-5.707 5.707a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
            <span>Functions</span>
          </div>
          <svg class="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div v-if="showFunctions" class="p-4 bg-gray-50">
          <div class="text-sm text-gray-600">
            You have not yet added any Functions.
          </div>
        </div>
      </div>
  
      <!-- Assets Section -->
      <div class="border-b">
        <div class="flex items-center justify-between p-4 bg-gray-50 cursor-pointer" @click="toggleAssets">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" :class="{ 'transform rotate-90': showAssets }" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 4.293a1 1 0 011.414 0L14.414 10l-5.707 5.707a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
            <span>Assets</span>
          </div>
          <svg class="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div v-if="showAssets" class="p-4 bg-gray-50">
          <div class="text-sm text-gray-600">
            You have not yet added any Assets.
          </div>
        </div>
      </div>
  
      <!-- Settings Section -->
      <div class="border-b">
        <div class="flex items-center justify-between p-4 bg-gray-50 cursor-pointer" @click="toggleSettings">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4" :class="{ 'transform rotate-90': showSettings }" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 4.293a1 1 0 011.414 0L14.414 10l-5.707 5.707a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
            <span>Settings</span>
          </div>
        </div>
        <div v-if="showSettings" class="p-4 bg-gray-50 space-y-3">
          <div class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947z" clip-rule="evenodd" />
            </svg>
            <span>Environment Variables</span>
          </div>
          <div class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer">
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <span>Dependencies</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const serviceName = computed(() => route.params.serviceName)
  
  const showFunctions = ref(true)
  const showAssets = ref(true)
  const showSettings = ref(true)
  
  const toggleFunctions = () => {
    showFunctions.value = !showFunctions.value
  }
  
  const toggleAssets = () => {
    showAssets.value = !showAssets.value
  }
  
  const toggleSettings = () => {
    showSettings.value = !showSettings.value
  }
  </script>