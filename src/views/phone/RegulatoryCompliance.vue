# src/views/phone/RegulatoryCompliance.vue
<template>
  <div class="px-8 py-6">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">Regulatory Compliance</h1>
      <p class="mt-2 text-gray-600">Manage your regulatory compliance requirements and documentation.</p>
    </div>

    <!-- Compliance Status -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div class="text-sm font-medium text-gray-500">COMPLIANCE STATUS</div>
          <div class="mt-2 flex items-center">
            <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span class="font-medium">Compliant</span>
          </div>
        </div>
        
        <div>
          <div class="text-sm font-medium text-gray-500">LAST UPDATED</div>
          <div class="mt-2">March 20, 2024</div>
        </div>
        
        <div>
          <div class="text-sm font-medium text-gray-500">NEXT REVIEW</div>
          <div class="mt-2">June 20, 2024</div>
        </div>
      </div>
    </div>

    <!-- Required Documentation -->
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <div class="p-4 border-b">
        <h2 class="font-medium">Required Documentation</h2>
      </div>
      <div class="p-4">
        <div class="space-y-4">
          <div v-for="doc in requiredDocs" :key="doc.id" class="border rounded-lg p-4">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-medium">{{ doc.name }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ doc.description }}</p>
                <div class="mt-2 text-sm">
                  <span :class="{
                    'text-green-600': doc.status === 'completed',
                    'text-yellow-600': doc.status === 'pending',
                    'text-red-600': doc.status === 'required'
                  }">
                    {{ formatStatus(doc.status) }}
                  </span>
                  <span class="text-gray-400 mx-2">•</span>
                  <span class="text-gray-500">
                    {{ doc.status === 'completed' ? 'Updated ' + doc.lastUpdated : 'Required by ' + doc.dueDate }}
                  </span>
                </div>
              </div>
              <button 
                class="px-4 py-2 text-sm"
                :class="[
                  doc.status === 'completed' 
                    ? 'text-blue-600 hover:text-blue-700' 
                    : 'bg-blue-600 text-white rounded hover:bg-blue-700'
                ]"
              >
                {{ doc.status === 'completed' ? 'Update' : 'Submit' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Compliance Reports -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="font-medium">Compliance Reports</h2>
        <button class="text-blue-600 hover:text-blue-700 text-sm">
          Download All
        </button>
      </div>
      <div class="divide-y">
        <div
          v-for="report in complianceReports"
          :key="report.id"
          class="flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <div>
            <div class="font-medium">{{ report.name }}</div>
            <div class="text-sm text-gray-500">Generated {{ report.date }}</div>
          </div>
          <button class="text-blue-600 hover:text-blue-700">
            Download
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Document {
  id: number
  name: string
  description: string
  status: 'completed' | 'pending' | 'required'
  lastUpdated?: string
  dueDate?: string
}

interface Report {
  id: number
  name: string
  date: string
}

const requiredDocs = ref<Document[]>([
  {
    id: 1,
    name: 'Business Registration',
    description: 'Official business registration or incorporation documents',
    status: 'completed',
    lastUpdated: 'March 15, 2024'
  },
  {
    id: 2,
    name: 'Tax Documentation',
    description: 'Current tax registration certificates',
    status: 'pending',
    dueDate: 'April 1, 2024'
  },
  {
    id: 3,
    name: 'Compliance Certificate',
    description: 'Industry-specific compliance certification',
    status: 'required',
    dueDate: 'March 30, 2024'
  }
])

const complianceReports = ref<Report[]>([
  {
    id: 1,
    name: 'Q1 2024 Compliance Report',
    date: 'March 15, 2024'
  },
  {
    id: 2,
    name: 'Q4 2023 Compliance Report',
    date: 'December 15, 2023'
  }
])

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
</script>