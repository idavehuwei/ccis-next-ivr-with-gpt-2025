# src/views/phone/ReleasedNumbers.vue
<template>
  <div class="px-8 py-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold">Released Numbers</h1>
        <p class="mt-2 text-gray-600">View and manage your recently released phone numbers.</p>
      </div>
      <button 
        @click="$router.push('/phone-numbers/buy')"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Buy a number
      </button>
    </div>

    <!-- Released Numbers List -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="font-medium">Released Numbers ({{ releasedNumbers.length }})</h2>
        <div class="flex items-center space-x-2">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search numbers..."
            class="px-3 py-1 border rounded-md text-sm focus:ring-1 focus:ring-blue-500"
          />
          <select
            v-model="filterStatus"
            class="px-3 py-1 border rounded-md text-sm focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="recently_released">Recently Released</option>
            <option value="pending_deletion">Pending Deletion</option>
          </select>
        </div>
      </div>

      <div class="divide-y">
        <div v-if="filteredNumbers.length === 0" class="p-8 text-center text-gray-500">
          No released numbers found.
        </div>

        <div
          v-for="number in filteredNumbers"
          :key="number.id"
          class="flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <div>
            <div class="font-medium">{{ number.phoneNumber }}</div>
            <div class="text-sm text-gray-500">{{ number.location }}</div>
            <div class="text-xs text-gray-400">Released on {{ number.releaseDate }}</div>
          </div>
          <div class="flex items-center space-x-6">
            <div class="text-sm text-gray-500">
              {{ number.capabilities.join(', ') }}
            </div>
            <div 
              class="px-2 py-1 text-xs rounded-full"
              :class="{
                'bg-yellow-100 text-yellow-700': number.status === 'recently_released',
                'bg-red-100 text-red-700': number.status === 'pending_deletion'
              }"
            >
              {{ formatStatus(number.status) }}
            </div>
            <div class="flex items-center space-x-2">
              <button 
                v-if="number.status === 'recently_released'"
                @click="reacquireNumber(number)"
                class="px-3 py-1.5 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
              >
                Reacquire
              </button>
              <button
                @click="deleteNumber(number)"
                class="text-gray-400 hover:text-red-600"
              >
                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t flex justify-between items-center text-sm">
        <div class="text-gray-500">
          Showing {{ filteredNumbers.length }} of {{ releasedNumbers.length }} numbers
        </div>
        <div class="flex space-x-2">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            :disabled="currentPage * itemsPerPage >= releasedNumbers.length"
            @click="currentPage++"
            class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ReleasedNumber {
  id: number
  phoneNumber: string
  location: string
  releaseDate: string
  capabilities: string[]
  status: 'recently_released' | 'pending_deletion'
}

// Mock data
const releasedNumbers = ref<ReleasedNumber[]>([
  {
    id: 1,
    phoneNumber: '+1 (912) 616-7549',
    location: 'Mount Vernon, GA US',
    releaseDate: '2024-03-20',
    capabilities: ['Voice', 'SMS', 'MMS'],
    status: 'recently_released'
  },
  {
    id: 2,
    phoneNumber: '+1 (912) 616-7550',
    location: 'Mount Vernon, GA US',
    releaseDate: '2024-03-19',
    capabilities: ['Voice', 'SMS'],
    status: 'pending_deletion'
  },
  {
    id: 3,
    phoneNumber: '+1 (912) 616-7551',
    location: 'Mount Vernon, GA US',
    releaseDate: '2024-03-18',
    capabilities: ['Voice', 'SMS', 'MMS', 'Fax'],
    status: 'recently_released'
  }
])

// Filtering and search
const searchQuery = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const filteredNumbers = computed(() => {
  return releasedNumbers.value
    .filter(number => {
      const matchesSearch = searchQuery.value === '' || 
        number.phoneNumber.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesStatus = filterStatus.value === '' || 
        number.status === filterStatus.value
      return matchesSearch && matchesStatus
    })
})

// Actions
const reacquireNumber = (number: ReleasedNumber) => {
  console.log('Reacquiring number:', number)
  // Implement reacquire logic
}

const deleteNumber = (number: ReleasedNumber) => {
  if (confirm(`Are you sure you want to permanently delete ${number.phoneNumber}?`)) {
    releasedNumbers.value = releasedNumbers.value.filter(n => n.id !== number.id)
  }
}

const formatStatus = (status: string) => {
  return status.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
</script>