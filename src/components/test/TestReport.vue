<!-- src/components/test/TestReport.vue -->
<template>
  <div class="test-report border rounded-lg overflow-hidden">
    <div class="bg-white p-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium">Test Results</h3>
        <div class="flex items-center space-x-4">
          <div class="text-sm">
            Success Rate:
            <span
              :class="successRate > 80 ? 'text-green-600' : successRate > 50 ? 'text-yellow-600' : 'text-red-600'"
            >
              {{ successRate }}%
            </span>
          </div>
          <button
            @click="clearResults"
            class="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="result in results"
          :key="result.timestamp.getTime()"
          class="p-4 rounded-lg"
          :class="result.success ? 'bg-green-50' : 'bg-red-50'"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium" :class="result.success ? 'text-green-700' : 'text-red-700'">
              {{ result.success ? 'Success' : 'Failed' }}
            </span>
            <span class="text-sm text-gray-500">
              {{ formatTimestamp(result.timestamp) }}
            </span>
          </div>

          <div class="space-y-2">
            <div v-for="output in result.actualOutputs" :key="output.timestamp?.getTime()">
              <div class="text-sm text-gray-600">
                {{ output.type === 'message' ? 'Response:' : 'Action:' }}
              </div>
              <div class="text-sm">
                {{ output.value }}
              </div>
            </div>
          </div>

          <div v-if="result.errors?.length" class="mt-2">
            <div class="text-sm text-red-600">Errors:</div>
            <ul class="list-disc list-inside text-sm text-red-600">
              <li v-for="(error, index) in result.errors" :key="index">
                {{ error }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TestCase, TestResult } from '@/types/test'

const props = defineProps<{
  testCase: TestCase
  results: TestResult[]
}>()

// 计算属性
const successRate = computed(() => {
  if (props.results.length === 0) return 0
  const successCount = props.results.filter(r => r.success).length
  return Math.round((successCount / props.results.length) * 100)
})

// 方法
const formatTimestamp = (date: Date) => {
  return date.toLocaleString()
}

const clearResults = () => {
  // 这里可以添加清除结果的逻辑
}
</script>