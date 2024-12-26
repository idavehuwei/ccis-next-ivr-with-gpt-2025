<!-- src/views/phone/BuyNumber.vue -->
<template>
    <div class="px-8 py-6">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold">Buy a Phone Number</h1>
        <p class="mt-2 text-gray-600">Search for available phone numbers in your desired location.</p>
      </div>
  
      <!-- Search Form -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              v-model="searchParams.country"
              class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Number Type
            </label>
            <select
              v-model="searchParams.type"
              class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
            >
              <option value="local">Local</option>
              <option value="toll-free">Toll-Free</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Area Code
            </label>
            <input
              type="text"
              v-model="searchParams.areaCode"
              placeholder="e.g. 415"
              class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
  
        <div class="mt-4 flex justify-end">
          <button
            @click="searchNumbers"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search Numbers
          </button>
        </div>
      </div>
  
      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b">
          <h2 class="font-medium">Available Numbers</h2>
        </div>
        <div class="divide-y">
          <div
            v-for="number in searchResults"
            :key="number.id"
            class="flex items-center justify-between p-4"
          >
            <div>
              <div class="font-medium">{{ number.phoneNumber }}</div>
              <div class="text-sm text-gray-500">{{ number.location }}</div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-500">
                {{ number.capabilities.join(', ') }}
              </div>
              <button
                @click="buyNumber(number)"
                class="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
              >
                Buy (${{ number.price }}/mo)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue'
  
  const searchParams = reactive({
    country: 'US',
    type: 'local',
    areaCode: ''
  })
  
  const searchResults = ref([
    {
      id: 1,
      phoneNumber: '+1 (415) 555-0123',
      location: 'San Francisco, CA',
      capabilities: ['Voice', 'SMS', 'MMS'],
      price: '1.00'
    },
    {
      id: 2,
      phoneNumber: '+1 (415) 555-0124',
      location: 'San Francisco, CA',
      capabilities: ['Voice', 'SMS'],
      price: '1.00'
    }
  ])
  
  const searchNumbers = () => {
    // Implement number search logic
    console.log('Searching with params:', searchParams)
  }
  
  const buyNumber = (number: any) => {
    // Implement number purchase logic
    console.log('Buying number:', number)
  }
  </script>