<!-- src/components/functions/AddMenu.vue -->
<template>
    <div class="relative">
      <button @click="toggleMenu" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Add +
      </button>
  
      <!-- Dropdown Menu -->
      <div v-if="showMenu" class="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg z-50">
        <div class="py-1">
          <a href="#" 
            class="block px-4 py-2 text-blue-600 hover:bg-gray-100"
            @click="handleAddFunction"
          >
            Add Function
          </a>
          <a href="#" 
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Upload File
          </a>
          <a href="#" 
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Add Asset (Static text file)
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const showMenu = ref(false)
  const emit = defineEmits(['add-function'])
  
  const toggleMenu = () => {
    showMenu.value = !showMenu.value
  }
  
  const handleAddFunction = () => {
    showMenu.value = false
    emit('add-function')
  }
  </script>