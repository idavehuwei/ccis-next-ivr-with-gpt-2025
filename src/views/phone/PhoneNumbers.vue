<!-- src/views/phone/PhoneNumbers.vue -->
<template>
  <div class="px-8 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Active Numbers</h1>
      <button 
        @click="$router.push('/phone-numbers/buy')"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Buy a number →
      </button>
    </div>

    <!-- Filters -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div class="text-sm font-medium text-gray-700 mb-2">Inventory Filters</div>
        <div class="text-sm font-medium text-gray-700 mb-2">Configuration Filters</div>
      </div>
      <div class="flex space-x-4">
        <div class="flex-1">
          <div class="flex space-x-2">
            <select v-model="filters.numberType" class="px-3 py-2 border rounded-md text-sm w-40">
              <option value="">Number</option>
              <option value="local">Local</option>
              <option value="toll-free">Toll-Free</option>
            </select>
            <input
              type="text"
              v-model="filters.number"
              placeholder="Search numbers..."
              class="flex-1 px-3 py-2 border rounded-md text-sm"
            />
          </div>
        </div>
        <div class="flex-1">
          <div class="flex space-x-2">
            <select v-model="filters.configType" class="px-3 py-2 border rounded-md text-sm w-40">
              <option value="">Voice URL</option>
              <option value="voice">Voice</option>
              <option value="messaging">Messaging</option>
            </select>
            <input
              type="text"
              v-model="filters.config"
              placeholder="Search configuration..."
              class="flex-1 px-3 py-2 border rounded-md text-sm"
            />
          </div>
        </div>
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Filter
        </button>
        <button class="text-blue-600 hover:text-blue-700">
          Reset filters
        </button>
      </div>
    </div>

    <!-- Numbers Table -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-sm font-medium text-gray-600">
        <div class="col-span-3">Number</div>
        <div class="col-span-3">Friendly Name</div>
        <div class="col-span-3">Capabilities</div>
        <div class="col-span-3">Active Configuration</div>
      </div>

      <div class="divide-y">
        <div v-for="number in activeNumbers" :key="number.id" class="p-4 hover:bg-gray-50">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-3">
              <div>
                <router-link
                  :to="`/phone-numbers/active/${number.id}`"
                  class="font-medium text-blue-600 hover:text-blue-700"
                >
                  {{ number.number }}
                </router-link>
                <div class="text-sm text-gray-500">{{ number.location }}</div>
              </div>
            </div>
            <div class="col-span-3">
              <div class="text-gray-700">{{ number.friendlyName }}</div>
            </div>
            <div class="col-span-3">
              <div class="flex space-x-4">
                <span v-if="number.capabilities.includes('Voice')" class="text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </span>
                <span v-if="number.capabilities.includes('SMS')" class="text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                  </svg>
                </span>
                <span v-if="number.capabilities.includes('MMS')" class="text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </span>
                <span v-if="number.capabilities.includes('Fax')" class="text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                  </svg>
                </span>
              </div>
            </div>
            <div class="col-span-3">
              <div class="text-sm">
                <div v-if="number.voiceUrl" class="mb-1">
                  <span class="text-gray-600">Voice:</span>
                  <span class="text-gray-500">{{ number.voiceUrl }}</span>
                </div>
                <div v-if="number.messagingUrl">
                  <span class="text-gray-600">Messaging:</span>
                  <span class="text-gray-500">{{ number.messagingUrl }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const filters = ref({
  numberType: '',
  number: '',
  configType: '',
  config: ''
})

const activeNumbers = ref([
  {
    id: 1,
    number: '+1 (912) 616-7546',
    location: 'Mount Vernon, GA',
    friendlyName: '(912) 616-7546',
    capabilities: ['Voice', 'SMS', 'MMS', 'Fax'],
    voiceUrl: 'Webhook (POST): https://demo.twilio.com/welcome/voice/',
    messagingUrl: 'Webhook (POST): https://demo.twilio.com/welcome/sms/reply/'
  },
  {
    id: 2,
    number: '+1 (912) 616-7547',
    location: 'Mount Vernon, GA',
    friendlyName: '(912) 616-7547',
    capabilities: ['Voice', 'SMS'],
    voiceUrl: 'Webhook (POST): https://demo.twilio.com/welcome/voice/',
    messagingUrl: 'Webhook (POST): https://demo.twilio.com/welcome/sms/reply/'
  },
  {
    id: 3,
    number: '+1 (912) 616-7548',
    location: 'Mount Vernon, GA',
    friendlyName: '(912) 616-7548', 
    capabilities: ['Voice', 'SMS', 'MMS', 'Fax'],
    voiceUrl: 'Webhook (POST): https://demo.twilio.com/welcome/voice/',
    messagingUrl: 'Webhook (POST): https://demo.twilio.com/welcome/sms/reply/'
  }
])
</script>