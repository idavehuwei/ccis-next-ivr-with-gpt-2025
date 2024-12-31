<template>
  <BaseNode
    type="set_variables"
    :title="nodeData.label"
    :is-selected="isSelected"
    :is-executing="isExecuting"
    :has-error="hasError"
  >
    <template #icon>
      <VariableIcon class="w-5 h-5 text-indigo-500" />
    </template>

    <template #default>
      <div class="p-4 space-y-4">
        <div>
          <div class="flex justify-between items-center">
            <label class="text-xs font-medium text-gray-500">VARIABLES</label>
            <button 
              @click="addVariable"
              class="text-indigo-600 hover:text-indigo-700 text-sm"
            >
              Add Variable
            </button>
          </div>
          
          <div class="space-y-2 mt-2">
            <div v-for="(variable, index) in nodeData.variables" :key="index">
              <div class="grid grid-cols-3 gap-2">
                <input
                  v-model="variable.name"
                  class="px-3 py-2 border rounded text-sm"
                  placeholder="Name"
                  @change="updateNode"
                />
                <select 
                  v-model="variable.type"
                  class="px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="array">Array</option>
                  <option value="object">Object</option>
                </select>
                <div class="flex gap-2">
                  <input
                    v-model="variable.value"
                    class="flex-1 px-3 py-2 border rounded text-sm"
                    placeholder="Value"
                    @change="updateNode"
                  />
                  <button @click="removeVariable(index)" class="text-red-500">
                    <XIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <textarea
                v-if="variable.type === 'array' || variable.type === 'object'"
                v-model="variable.value"
                rows="3"
                class="w-full px-3 py-2 border rounded text-sm font-mono"
                placeholder="Enter JSON value"
                @change="updateNode"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #handles>
      <Handle
        type="source"
        :position="Position.Bottom"
        id="next"
        class="handle-success"
      >
        <span class="handle-label">Next</span>
      </Handle>
    </template>
  </BaseNode>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { Variable as VariableIcon, X as XIcon } from 'lucide-vue-next'
import BaseNode from './BaseNode.vue'

const props = defineProps<{
  id: string
  data: {
    label?: string
    variables: Array<{
      name: string
      type: string
      value: any
    }>
  }
  isSelected?: boolean
}>()

const emit = defineEmits(['update'])

const nodeData = ref({
  label: props.data.label || 'Set Variables',  
  variables: props.data.variables || []
})

const isExecuting = ref(false)
const hasError = ref(false)

const addVariable = () => {
  nodeData.value.variables.push({
    name: '',
    type: 'string',
    value: ''
  })
  updateNode()
}

const removeVariable = (index: number) => {
  nodeData.value.variables.splice(index, 1)
  updateNode()
}

const updateNode = () => {
  emit('update', {
    ...props.data,
    ...nodeData.value
  })
}
</script>