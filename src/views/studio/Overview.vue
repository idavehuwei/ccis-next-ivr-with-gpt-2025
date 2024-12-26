# src/views/studio/Overview.vue
<template>
  <div class="p-8 max-w-7xl">
    <h1 class="text-2xl text-gray-700 mb-6">Studio Dashboard</h1>

    <!-- Welcome & Get Started Card -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium mb-3">Welcome to Studio!</h2>
          <p class="text-gray-600 mb-4">
            A visual interface to build, scale, and iterate on communications workflows. Be sure to check out the User
            Guide if you need help.
          </p>
          <p class="text-gray-600 mb-6">
            We can't wait to see what you build.
          </p>
          <div class="space-y-3">
            <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    @click="showCreateDialog = true">
              Create a flow
            </button>
            
            <CreateFlowDialog
              v-model="showCreateDialog"
              @create="handleCreateFlow"
            />
            <div>
              <a href="#" class="text-blue-600 hover:text-blue-700 text-sm">User Guide →</a>
            </div>
          </div>
        </div>
      </div>

      <!-- What can you build -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium mb-4">What can you build with Studio?</h2>
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="mt-1">
                <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                        stroke-width="2"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium">IVR</h3>
                <p class="text-sm text-gray-500">Build interactive voice response systems</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="mt-1">
                <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium">Appointment reminders</h3>
                <p class="text-sm text-gray-500">Automate scheduling and notifications</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="mt-1">
                <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium">Chat Bots</h3>
                <p class="text-sm text-gray-500">Create intelligent conversational agents</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div class="mt-1">
                <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium">Order Notifications</h3>
                <p class="text-sm text-gray-500">Automated order status updates</p>
              </div>
            </div>

            <div class="pt-4">
              <a href="#" class="text-blue-600 hover:text-blue-700 text-sm">
                Check Out the Studio User Guide →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Why Studio Section -->
    <div class="mb-8">
      <h2 class="text-xl text-gray-700 mb-6">Why Studio?</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Faster to build -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="font-medium mb-3">Faster to build</h3>
          <p class="text-gray-600">
            Meet your ever-changing business needs by creating and tweaking logic on the fly. Leverage best practices that are
            baked into our library of widgets.
          </p>
        </div>

        <!-- Iterate Quickly -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="font-medium mb-3">Iterate Quickly</h3>
          <p class="text-gray-600">
            No need to deploy new code just to change copy. A/B test your text messages and text-to-speech in real-time using
            a visual editor.
          </p>
        </div>

        <!-- Cross-team collaboration -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="font-medium mb-3">Cross-team collaboration</h3>
          <p class="text-gray-600">
            Enable your product and support teams to make customer experience changes without engineering involvement.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CreateFlowDialog from '../../components/CreateFlowDialog.vue'

const showCreateDialog = ref(false)

const handleCreateFlow = (name: string) => {
  console.log('Creating new flow:', name) 
}
</script>