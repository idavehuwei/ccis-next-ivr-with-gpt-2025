<!-- src/views/voice/Recordings.vue -->
<template>
    <div class="px-8 py-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-semibold">Call Recordings</h1>
          <p class="mt-2 text-gray-600">Access and manage your call recordings</p>
        </div>
        <div class="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search recordings..."
            class="px-4 py-2 border rounded-md"
            v-model="searchQuery"
          />
          <select 
            class="px-4 py-2 border rounded-md"
            v-model="filterType"
          >
            <option value="all">All Types</option>
            <option value="calls">Calls</option>
            <option value="voicemail">Voicemail</option>
            <option value="conferences">Conferences</option>
          </select>
        </div>
      </div>
  
      <!-- Recordings List -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-4 border-b flex justify-between items-center">
          <h2 class="font-medium">Recent Recordings</h2>
          <div class="flex items-center space-x-2">
            <button 
              class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
              @click="toggleSelectAll"
            >
              {{ isAllSelected ? 'Deselect All' : 'Select All' }}
            </button>
            <button 
              v-if="selectedRecordings.length > 0"
              class="px-3 py-1.5 text-sm text-red-600 hover:text-red-700"
              @click="deleteSelected"
            >
              Delete Selected
            </button>
          </div>
        </div>
        
        <div class="divide-y">
          <div
            v-for="recording in filteredRecordings"
            :key="recording.id"
            class="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div class="flex items-center space-x-4">
              <input 
                type="checkbox"
                :checked="selectedRecordings.includes(recording.id)"
                @change="toggleSelection(recording.id)"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <button 
                class="text-gray-500 hover:text-gray-700"
                @click="playRecording(recording.id)"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <div>
                <div class="font-medium">{{ recording.name }}</div>
                <div class="text-sm text-gray-500">
                  Duration: {{ recording.duration }} · {{ recording.type }}
                </div>
                <div class="text-xs text-gray-400">{{ recording.date }}</div>
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-500">{{ recording.size }}</div>
              <div class="flex space-x-2">
                <button 
                  class="p-2 text-gray-500 hover:text-gray-700" 
                  title="Download"
                  @click="downloadRecording(recording.id)"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button 
                  class="p-2 text-gray-500 hover:text-gray-700"
                  title="Share"
                  @click="shareRecording(recording.id)"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <button 
                  class="p-2 text-red-500 hover:text-red-700"
                  title="Delete"
                  @click="deleteRecording(recording.id)"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Pagination -->
        <div class="p-4 border-t flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Showing {{ filteredRecordings.length }} of {{ recordings.length }} recordings
          </div>
          <div class="flex space-x-2">
            <button 
              class="px-3 py-1 border rounded hover:bg-gray-50"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              Previous
            </button>
            <button 
              class="px-3 py-1 border rounded hover:bg-gray-50"
              :disabled="currentPage * itemsPerPage >= recordings.length"
              @click="currentPage++"
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
  
  const searchQuery = ref('')
  const filterType = ref('all')
  const currentPage = ref(1)
  const itemsPerPage = 10
  const selectedRecordings = ref<number[]>([])
  
  const recordings = ref([
    {
      id: 1,
      name: 'Customer Support Call #1234',
      duration: '5:23',
      type: 'Call',
      date: 'March 20, 2024',
      size: '2.3 MB'
    },
    {
      id: 2,
      name: 'Weekly Team Meeting',
      duration: '45:12',
      type: 'Conference',
      date: 'March 19, 2024',
      size: '15.7 MB'
    },
    {
      id: 3,
      name: 'Voicemail from John',
      duration: '0:45',
      type: 'Voicemail',
      date: 'March 18, 2024',
      size: '0.8 MB'
    }
  ])
  
  // Computed
  const filteredRecordings = computed(() => {
    return recordings.value.filter(recording => {
      const matchesSearch = recording.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesType = filterType.value === 'all' || recording.type.toLowerCase() === filterType.value
      return matchesSearch && matchesType
    })
  })
  
  const isAllSelected = computed(() => {
    return recordings.value.length > 0 && 
           selectedRecordings.value.length === recordings.value.length
  })
  
  // Methods
  const toggleSelection = (id: number) => {
    const index = selectedRecordings.value.indexOf(id)
    if (index === -1) {
      selectedRecordings.value.push(id)
    } else {
      selectedRecordings.value.splice(index, 1)
    }
  }
  
  const toggleSelectAll = () => {
    if (isAllSelected.value) {
      selectedRecordings.value = []
    } else {
      selectedRecordings.value = recordings.value.map(r => r.id)
    }
  }
  
  const playRecording = (id: number) => {
    console.log('Playing recording:', id)
  }
  
  const downloadRecording = (id: number) => {
    console.log('Downloading recording:', id)
  }
  
  const shareRecording = (id: number) => {
    console.log('Sharing recording:', id)
  }
  
  const deleteRecording = (id: number) => {
    if (confirm('Are you sure you want to delete this recording?')) {
      recordings.value = recordings.value.filter(r => r.id !== id)
      const index = selectedRecordings.value.indexOf(id)
      if (index !== -1) {
        selectedRecordings.value.splice(index, 1)
      }
    }
  }
  
  const deleteSelected = () => {
    if (confirm(`Are you sure you want to delete ${selectedRecordings.value.length} recordings?`)) {
      recordings.value = recordings.value.filter(r => !selectedRecordings.value.includes(r.id))
      selectedRecordings.value = []
    }
  }
  </script>