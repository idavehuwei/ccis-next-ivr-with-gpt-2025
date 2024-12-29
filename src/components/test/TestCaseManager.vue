<!-- src/components/test/TestCaseManager.vue -->
<template>
  <div class="test-case-manager">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium">Test Cases</h3>
      <button
        @click="showCreateDialog = true"
        class="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        New Test Case
      </button>
    </div>

    <!-- 测试用例列表 -->
    <div class="space-y-2">
      <div
        v-for="testCase in testCases"
        :key="testCase.id"
        class="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50"
        :class="{'border-blue-500': selectedTestCase?.id === testCase.id}"
      >
        <div>
          <h4 class="font-medium">{{ testCase.name }}</h4>
          <p v-if="testCase.description" class="text-sm text-gray-500">
            {{ testCase.description }}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="selectTestCase(testCase)"
            class="px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
          >
            Select
          </button>
          <button
            @click="() => handleDelete(testCase)"
            class="px-2 py-1 text-sm text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- 创建测试用例对话框 -->
    <Dialog :is-open="showCreateDialog" @close="showCreateDialog = false">
      <DialogTitle as="h3" class="text-lg font-medium text-gray-900 mb-4">
        Create Test Case
      </DialogTitle>

      <form @submit.prevent="handleCreate">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              v-model="newTestCase.name"
              type="text"
              required
              class="w-full rounded-md border-gray-300"
              placeholder="Enter test case name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              v-model="newTestCase.description"
              rows="3"
              class="w-full rounded-md border-gray-300"
              placeholder="Enter test case description"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Initial Variables
            </label>
            <div class="space-y-2">
              <div
                v-for="(value, key) in newTestCase.variables"
                :key="key"
                class="flex items-center space-x-2"
              >
                <input
                  v-model="variableKeys[key]"
                  type="text"
                  class="w-1/3 rounded-md border-gray-300"
                  placeholder="Variable name"
                />
                <input
                  v-model="newTestCase.variables[key]"
                  type="text"
                  class="flex-1 rounded-md border-gray-300"
                  placeholder="Value"
                />
                <button
                  type="button"
                  @click="removeVariable(key)"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button
                type="button"
                @click="addVariable"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Variable
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            @click="showCreateDialog = false"
            class="px-4 py-2 text-sm text-gray-700 bg-white border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </form>
    </Dialog>

    <!-- 删除确认对话框 -->
    <Dialog :is-open="showDeleteDialog" @close="showDeleteDialog = false">
      <DialogTitle as="h3" class="text-lg font-medium text-gray-900 mb-4">
        Delete Test Case
      </DialogTitle>

      <p class="text-sm text-gray-500">
        Are you sure you want to delete this test case? This action cannot be undone.
      </p>

      <div class="mt-6 flex justify-end space-x-3">
        <button
          @click="showDeleteDialog = false"
          class="px-4 py-2 text-sm text-gray-700 bg-white border rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="confirmDelete"
          class="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dialog from '@/components/ui/Dialog.vue'
import { DialogTitle } from '@headlessui/vue'
import type { TestCase } from '@/types/test'

const props = defineProps<{
  testCases: TestCase[]
}>()

const emit = defineEmits<{
  (e: 'select', testCase: TestCase): void
  (e: 'create', testCase: TestCase): void
  (e: 'delete', testCaseId: string): void
}>()

// 状态
const selectedTestCase = ref<TestCase | null>(null)
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const testCaseToDelete = ref<TestCase | null>(null)

// 新测试用例表单
const newTestCase = ref({
  name: '',
  description: '',
  variables: {} as Record<string, any>
})

const variableKeys = ref<Record<string, string>>({})

// 方法
const selectTestCase = (testCase: TestCase) => {
  selectedTestCase.value = testCase
  emit('select', testCase)
}

const handleCreate = () => {
  // 处理变量名重命名
  const variables: Record<string, any> = {}
  Object.entries(newTestCase.value.variables).forEach(([key, value]) => {
    if (variableKeys.value[key]) {
      variables[variableKeys.value[key]] = value
    }
  })

  const testCase: TestCase = {
    id: Date.now().toString(),
    name: newTestCase.value.name,
    description: newTestCase.value.description,
    inputs: [],
    expectedOutputs: [],
    variables
  }

  emit('create', testCase)
  showCreateDialog.value = false
  resetForm()
}

const handleDelete = (testCase: TestCase) => {
  testCaseToDelete.value = testCase
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  if (testCaseToDelete.value) {
    emit('delete', testCaseToDelete.value.id)
    if (selectedTestCase.value?.id === testCaseToDelete.value.id) {
      selectedTestCase.value = null
    }
  }
  showDeleteDialog.value = false
  testCaseToDelete.value = null
}

const addVariable = () => {
  const key = `var${Object.keys(newTestCase.value.variables).length + 1}`
  newTestCase.value.variables[key] = ''
  variableKeys.value[key] = ''
}

const removeVariable = (key: string) => {
  delete newTestCase.value.variables[key]
  delete variableKeys.value[key]
}

const resetForm = () => {
  newTestCase.value = {
    name: '',
    description: '',
    variables: {}
  }
  variableKeys.value = {}
}
</script>