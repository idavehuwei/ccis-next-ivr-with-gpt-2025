<!-- src/views/functions/FunctionsOverview.vue -->
<template>
    <div class="px-8 py-6">
      <h1 class="text-2xl font-semibold mb-6">Overview</h1>
  
      <!-- Functions 介绍 -->
      <div class="mb-8">
        <p class="text-gray-600 mb-4">
          Twilio Functions enables you to create communication applications, hosted and deployed entirely on our cloud infrastructure. Write custom code with Twilio Functions and store files with Twilio Assets.
        </p>
  
        <p class="text-gray-600 mb-6">
          Each project you work on will be contained in a "Service". A Service is an application container to store all your Functions and Assets, and used to manage deployments and separate environments. You will likely create a new Service for each new project you work on.
        </p>
  
        <div class="flex items-center space-x-4 mb-8">
            <button 
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                @click="showCreateDialog = true"
            >
                Create Service
            </button>
            <button class="text-blue-600 hover:text-blue-700">Manage Services</button>
            <button class="text-blue-600 hover:text-blue-700 flex items-center">
                Functions Quickstart
                <svg class="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                </svg>
            </button>
            </div>
      </div>
  
      <!-- Features Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Write Custom Code -->
        <div>
          <h2 class="text-xl font-medium mb-4">Write custom code using Twilio Functions</h2>
          <p class="text-gray-600 mb-4">
            With Functions, you can build communication applications without worrying about maintaining or scaling web infrastructure — it's all managed seamlessly by us and scales automatically with your use case.
          </p>
          <div class="bg-gray-900 rounded-lg p-4">
            <!-- Code Editor UI Mock -->
            <div class="space-y-2">
              <div class="w-3/4 h-2 bg-blue-500/20 rounded"></div>
              <div class="w-1/2 h-2 bg-blue-500/20 rounded"></div>
              <div class="w-2/3 h-2 bg-blue-500/20 rounded"></div>
            </div>
          </div>
        </div>
  
        <!-- Host Files -->
        <div>
          <h2 class="text-xl font-medium mb-4">Host the files you need in Twilio Assets</h2>
          <p class="text-gray-600 mb-4">
            Twilio Assets is a static file hosting service that enables you to quickly and easily host the files needed by your Twilio applications.
          </p>
          <div class="bg-gray-900 rounded-lg p-4">
            <!-- Assets UI Mock -->
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 bg-blue-500/20 rounded"></div>
                <div class="w-1/2 h-2 bg-blue-500/20 rounded"></div>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 bg-blue-500/20 rounded"></div>
                <div class="w-1/3 h-2 bg-blue-500/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateServiceDialog
      v-model="showCreateDialog"
    />

    </div>
  </template>


<script setup lang="ts">
import { ref } from 'vue'
import CreateServiceDialog from './CreateServiceDialog.vue'

const showCreateDialog = ref(false)
</script>
