<!-- src/views/functions/ServiceEditor.vue -->
<template>
    <div class="h-screen flex flex-col">
      <div class="flex-1 flex">
        <!-- Left Sidebar -->
        <SidePanel :functions="functions" />
  
        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col">
          <!-- Add Button -->
          <div class="p-4 bg-white border-b">
            <AddMenu @add-function="showFunctionEditor = true" />
          </div>
  
          <!-- Content Area -->
          <template v-if="showFunctionEditor">
            <FunctionEditor />
          </template>
          <template v-else>
            <!-- Welcome content -->
            <div class="flex-1 flex items-center justify-center bg-gray-50">
              <div class="text-center max-w-lg">
                <!-- ... 欢迎内容 ... -->
              </div>
            </div>
          </template>
        </div>
      </div>
  
      <!-- Bottom status bar -->
      <div class="h-12 bg-white border-t flex items-center justify-between px-4">
        <div class="text-sm text-gray-600">{{ serviceUrl }}</div>
        <button class="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700">
          Deploy All
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import SidePanel from './SidePanel.vue'
  import AddMenu from './AddMenu.vue'
  import FunctionEditor from './FunctionEditor.vue'
  
  const route = useRoute()
  const serviceName = computed(() => route.params.serviceName)
  const serviceUrl = computed(() => `${serviceName.value}.twil.io`)
  
  const showFunctionEditor = ref(false)
  const functions = ref([])
  </script>