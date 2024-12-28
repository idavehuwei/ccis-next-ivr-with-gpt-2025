<!-- src/components/config/SetVariablesConfig.vue -->
<template>
  <div class="p-4 space-y-6">
    <!-- Widget Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Widget Name</label>
      <input
        type="text"
        v-model="nodeConfig.label"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        @change="emitUpdate"
      />
    </div>

    <!-- Variables -->
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="text-sm font-medium text-gray-900">Variables</h3>
        <button
          type="button"
          @click="addVariable"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Variable
        </button>
      </div>

      <div class="space-y-4">
        <div v-for="(entry, index) in variableEntries" :key="index"
             class="bg-gray-50 rounded-lg p-4 space-y-4">
          <!-- Variable Name -->
          <div>
            <label class="block text-xs font-medium text-gray-500">VARIABLE NAME</label>
            <input
              type="text"
              v-model="entry.key"
              placeholder="flow.variable_name"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              @change="updateVariables"
            />
          </div>

          <!-- Value Type -->
          <div>
            <label class="block text-xs font-medium text-gray-500">VALUE TYPE</label>
            <select
              v-model="entry.type"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              @change="updateValueType(index)"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="json">JSON</option>
              <option value="template">Template</option>
            </select>
          </div>

          <!-- Value Input -->
          <div>
            <label class="block text-xs font-medium text-gray-500">VALUE</label>
            <!-- String Input -->
            <input
              v-if="entry.type === 'string'"
              type="text"
              v-model="entry.value"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              @change="updateVariables"
            />
            <!-- Number Input -->
            <input
              v-if="entry.type === 'number'"
              type="number"
              v-model.number="entry.value"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              @change="updateVariables"
            />
            <!-- Boolean Input -->
            <select
              v-if="entry.type === 'boolean'"
              v-model="entry.value"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              @change="updateVariables"
            >
              <option :value="true">True</option>
              <option :value="false">False</option>
            </select>
            <!-- JSON Input -->
            <textarea
              v-if="entry.type === 'json'"
              v-model="entry.value"
              rows="4"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
              @change="updateJsonValue(index)"
            ></textarea>
            <!-- Template Input -->
            <textarea
              v-if="entry.type === 'template'"
              v-model="entry.value"
              rows="2"
              placeholder="Hello {{flow.customer_name}}!"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              @change="updateVariables"
            ></textarea>
          </div>

          <!-- Help Text -->
          <div v-if="entry.type === 'template'" class="mt-1">
            <p class="text-xs text-gray-500">
              Use {{flow.variable}} syntax to reference other variables
            </p>
          </div>
          <div v-if="entry.type === 'json'" class="mt-1">
            <p class="text-xs text-gray-500">
              Enter valid JSON data
            </p>
          </div>

          <!-- Remove Button -->
          <div class="flex justify-end">
            <button
              type="button"
              @click="removeVariable(index)"
              class="inline-flex items-center px-2.5 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  nodeId: string
  data: {
    label?: string
    variables?: Record<string, any>
  }
}>()

const emit = defineEmits<{
  (e: 'update', nodeId: string, data: any): void
}>()

interface VariableEntry {
  key: string
  type: 'string' | 'number' | 'boolean' | 'json' | 'template'
  value: any
}

// Node configuration state
const nodeConfig = ref({
  label: props.data?.label || 'Set Variables',
  variables: { ...props.data?.variables } || {}
})

// Variable entries for form handling
const variableEntries = ref<VariableEntry[]>([])

// Initialize variable entries from props
watch(() => props.data?.variables, (newVariables) => {
  if (newVariables) {
    variableEntries.value = Object.entries(newVariables).map(([key, value]) => ({
      key,
      type: getValueType(value),
      value
    }))
  }
}, { immediate: true, deep: true })

// Get value type
function getValueType(value: any): VariableEntry['type'] {
  if (typeof value === 'string') {
    if (value.includes('{{') && value.includes('}}')) {
      return 'template'
    }
    return 'string'
  }
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'object') return 'json'
  return 'string'
}

// Update value type
function updateValueType(index: number) {
  const entry = variableEntries.value[index]
  // Convert value based on new type
  switch (entry.type) {
    case 'string':
      entry.value = String(entry.value)
      break
    case 'number':
      entry.value = Number(entry.value) || 0
      break
    case 'boolean':
      entry.value = Boolean(entry.value)
      break
    case 'json':
      try {
        if (typeof entry.value !== 'object') {
          entry.value = '{}'
        } else {
          entry.value = JSON.stringify(entry.value, null, 2)
        }
      } catch {
        entry.value = '{}'
      }
      break
    case 'template':
      entry.value = String(entry.value)
      break
  }
  updateVariables()
}

// Update JSON value
function updateJsonValue(index: number) {
  const entry = variableEntries.value[index]
  try {
    // Validate JSON
    const parsed = JSON.parse(entry.value)
    entry.value = JSON.stringify(parsed, null,2)
    updateVariables()
  } catch (error) {
    console.error('Invalid JSON:', error)
    // Keep the invalid value for user to fix
  }
}

// Variable Management
function addVariable() {
  variableEntries.value.push({
    key: `flow.variable_${variableEntries.value.length + 1}`,
    type: 'string',
    value: ''
  })
  updateVariables()
}

function removeVariable(index: number) {
  variableEntries.value.splice(index, 1)
  updateVariables()
}

// Update variables object from entries
function updateVariables() {
  const variables: Record<string, any> = {}
  for (const entry of variableEntries.value) {
    if (!entry.key) continue
    
    let value: any = entry.value
    if (entry.type === 'json') {
      try {
        value = JSON.parse(entry.value)
      } catch {
        value = null
      }
    } else if (entry.type === 'number') {
      value = Number(entry.value) || 0
    } else if (entry.type === 'boolean') {
      value = Boolean(entry.value)
    }
    
    variables[entry.key] = value
  }
  
  nodeConfig.value.variables = variables
  emitUpdate()
}

// Emit update event
const emitUpdate = () => {
  emit('update', props.nodeId, nodeConfig.value)
}
</script>