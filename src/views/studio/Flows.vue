<!-- src/views/studio/Flows.vue -->
<template>
  <div class="px-8 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Flows</h1>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Create New Flow
      </button>
    </div>

    <!-- Flow Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="flow in flows" :key="flow.id"
           class="bg-white rounded-lg shadow-sm">
        <div class="p-5">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium">{{ flow.name }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ flow.description }}</p>
            </div>
            <div :class="[
              'px-2 py-1 rounded text-xs',
              flow.status === 'Published' ? 'bg-green-100 text-green-700' : 
              'bg-yellow-100 text-yellow-700'
            ]">
              {{ flow.status }}
            </div>
          </div>
          
          <div class="mt-4 text-sm text-gray-500">
            Last edited {{ flow.lastEdited }}
          </div>

          <div class="mt-4 pt-4 border-t flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <button class="text-gray-500 hover:text-gray-700">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button class="text-gray-500 hover:text-gray-700">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <button @click="openEditor(flow.id)" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Open Editor
            </button>

          </div>
        </div>
      </div>

      <!-- Create New Flow Card -->
      <div class="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 4v16m8-8H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Create new flow</h3>
        <p class="mt-1 text-sm text-gray-500">Get started with a new flow</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()


const flows = ref([])


const openEditor = (flowId: number) => {
  const uniqueID = Date.now()
  router.push({ path: `/studio/flows/${uniqueID}/edit` })
}

onMounted(async () => {
  const response = await fetch('/api/flows')
  const result = await response.json()
  if (result.code === 200) {
    flows.value = result.data
  }
})
</script>