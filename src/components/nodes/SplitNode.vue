// src/components/nodes/SplitNode.vue
<template>
  <BaseNode
    type="split"
    :title="nodeData.label"
    :is-selected="isSelected"
    :is-executing="isExecuting"
    :has-error="hasError"
  >
    <template #icon>
      <GitBranchIcon class="w-5 h-5 text-blue-500" />
    </template>

    <template #default>
      <div class="p-4 space-y-4">
        <!-- Split Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Split Type</label>
          <select
            v-model="nodeData.splitType"
            class="mt-1 block w-full rounded-md border-gray-300"
            @change="handleSplitTypeChange"
          >
            <option value="variable">Variable Based</option>
            <option value="random">Random</option>
            <option value="time">Time Based</option>
            <option value="custom">Custom Logic</option>
          </select>
        </div>

        <!-- Variable Based Split -->
        <template v-if="nodeData.splitType === 'variable'">
          <div class="space-y-4">
            <!-- Variable Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Variable</label>
              <select
                v-model="nodeData.variable"
                class="mt-1 block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              >
                <option value="">Select Variable...</option>
                <option 
                  v-for="variable in availableVariables" 
                  :key="variable.name"
                  :value="variable.name"
                >
                  {{ variable.name }}
                </option>
              </select>
            </div>

            <!-- Conditions -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium text-gray-700">Conditions</label>
                <button
                  @click="addCondition"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  Add Condition
                </button>
              </div>

              <div class="space-y-3">
                <div 
                  v-for="(condition, index) in nodeData.conditions"
                  :key="index"
                  class="p-3 border rounded-lg bg-gray-50"
                >
                  <div class="flex items-center gap-2">
                    <!-- Operator -->
                    <select
                      v-model="condition.operator"
                      class="w-32 rounded-md border-gray-300"
                      @change="handleUpdate"
                    >
                      <option value="equals">equals</option>
                      <option value="not_equals">not equals</option>
                      <option value="contains">contains</option>
                      <option value="starts_with">starts with</option>
                      <option value="ends_with">ends with</option>
                      <option value="greater_than">greater than</option>
                      <option value="less_than">less than</option>
                    </select>

                    <!-- Value -->
                    <input
                      v-model="condition.value"
                      type="text"
                      class="flex-1 rounded-md border-gray-300"
                      placeholder="Value"
                      @change="handleUpdate"
                    />

                    <!-- Handle Name -->
                    <input
                      v-model="condition.handleId"
                      type="text"
                      class="w-32 rounded-md border-gray-300"
                      placeholder="Output name"
                      @change="handleUpdate"
                    />

                    <!-- Remove Button -->
                    <button
                      @click="removeCondition(index)"
                      class="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Default Output -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Default Output</label>
              <input
                v-model="nodeData.defaultOutput"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300"
                placeholder="default"
                @change="handleUpdate"
              />
            </div>
          </div>
        </template>

        <!-- Random Split -->
        <template v-if="nodeData.splitType === 'random'">
          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium text-gray-700">Branches</label>
                <button
                  @click="addBranch"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  Add Branch
                </button>
              </div>

              <div class="space-y-3">
                <div 
                  v-for="(branch, index) in nodeData.branches"
                  :key="index"
                  class="flex items-center gap-2"
                >
                  <input
                    v-model.number="branch.percentage"
                    type="number"
                    min="0"
                    max="100"
                    class="w-24 rounded-md border-gray-300"
                    @change="handleUpdate"
                  />
                  <span class="text-gray-500">%</span>
                  <input
                    v-model="branch.handleId"
                    type="text"
                    class="flex-1 rounded-md border-gray-300"
                    placeholder="Output name"
                    @change="handleUpdate"
                  />
                  <button
                    @click="removeBranch(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Percentage Total Warning -->
              <div 
                v-if="totalPercentage !== 100"
                class="mt-2 text-sm text-red-500"
              >
                Total percentage must equal 100% (currently {{ totalPercentage }}%)
              </div>
            </div>
          </div>
        </template>

        <!-- Time Based Split -->
        <template v-if="nodeData.splitType === 'time'">
          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium text-gray-700">Time Rules</label>
                <button
                  @click="addTimeRule"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  Add Rule
                </button>
              </div>

              <div class="space-y-3">
                <div 
                  v-for="(rule, index) in nodeData.timeRules"
                  :key="index"
                  class="p-3 border rounded-lg bg-gray-50 space-y-2"
                >
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="block text-xs text-gray-500">Start Time</label>
                      <input
                        v-model="rule.startTime"
                        type="time"
                        class="mt-1 block w-full rounded-md border-gray-300"
                        @change="handleUpdate"
                      />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500">End Time</label>
                      <input
                        v-model="rule.endTime"
                        type="time"
                        class="mt-1 block w-full rounded-md border-gray-300"
                        @change="handleUpdate"
                      />
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <input
                      v-model="rule.handleId"
                      type="text"
                      class="flex-1 rounded-md border-gray-300"
                      placeholder="Output name"
                      @change="handleUpdate"
                    />
                    <button
                      @click="removeTimeRule(index)"
                      class="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Default Time Output -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Default Output</label>
                <input
                  v-model="nodeData.defaultTimeOutput"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300"
                  placeholder="default"
                  @change="handleUpdate"
                />
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>

    <!-- Dynamic Output Handles -->
    <template #handles>
      <template v-if="nodeData.splitType === 'variable'">
        <div 
          v-for="condition in nodeData.conditions"
          :key="condition.handleId"
          class="handle-wrapper"
        >
          <Handle
            type="source"
            :position="Position.Right"
            :id="condition.handleId"
            class="handle-condition"
          >
            <span class="handle-label">{{ condition.handleId }}</span>
          </Handle>
        </div>
        <Handle
          v-if="nodeData.defaultOutput"
          type="source"
          :position="Position.Right"
          :id="nodeData.defaultOutput"
          class="handle-default"
        >
          <span class="handle-label">Default</span>
        </Handle>
      </template>

      <template v-if="nodeData.splitType === 'random'">
        <div 
          v-for="branch in nodeData.branches"
          :key="branch.handleId"
          class="handle-wrapper"
        >
          <Handle
            type="source"
            :position="Position.Right"
            :id="branch.handleId"
            class="handle-random"
          >
            <span class="handle-label">{{ branch.handleId }} ({{ branch.percentage }}%)</span>
          </Handle>
        </div>
      </template>

      <template v-if="nodeData.splitType === 'time'">
        <div 
          v-for="rule in nodeData.timeRules"
          :key="rule.handleId"
          class="handle-wrapper"
        >
          <Handle
            type="source"
            :position="Position.Right"
            :id="rule.handleId"
            class="handle-time"
          >
            <span class="handle-label">{{ rule.handleId }}</span>
          </Handle>
        </div>
        <Handle
          v-if="nodeData.defaultTimeOutput"
          type="source"
          :position="Position.Right"
          :id="nodeData.defaultTimeOutput"
          class="handle-default"
        >
          <span class="handle-label">Default</span>
        </Handle>
      </template>
    </template>
  </BaseNode>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { GitBranch, Trash } from 'lucide-vue-next'
import BaseNode from './BaseNode.vue'
import { useFlowStore } from '@/stores/flow'

const props = defineProps<{
  id: string
  data: any
  isSelected?: boolean
}>()

const emit = defineEmits(['update'])
const flowStore = useFlowStore()

// Node data
const nodeData = ref({
  label: props.data.label || 'Split',
  splitType: props.data.splitType || 'variable',
  // Variable based split
  variable: props.data.variable || '',
  conditions: props.data.conditions || [],
  defaultOutput: props.data.defaultOutput || 'default',
  // Random split
  branches: props.data.branches || [],
  // Time based split
  timeRules: props.data.timeRules || [],
  defaultTimeOutput: props.data.defaultTimeOutput || 'default'
})

// Computed
const availableVariables = computed(() => flowStore.variables)

const totalPercentage = computed(() => {
  return nodeData.value.branches.reduce((sum, branch) => sum + (branch.percentage || 0), 0)
})

const isExecuting = ref(false)
const hasError = ref(false)

// Methods
const handleSplitTypeChange = () => {
  // Reset relevant data when split type changes
  switch (nodeData.value.splitType) {
    case 'variable':
      nodeData.value.branches = []
      nodeData.value.timeRules = []
      break;
    case 'random':
      nodeData.value.conditions = []
      nodeData.value.timeRules = []
      break;
    case 'time':
      nodeData.value.conditions = []
      nodeData.value.branches = []
      break;
  }
  handleUpdate()
}

// Condition Management
const addCondition = () => {
  nodeData.value.conditions.push({
    operator: 'equals',
    value: '',
    handleId: `condition_${nodeData.value.conditions.length + 1}`
  })
  handleUpdate()
}

const removeCondition = (index: number) => {
  nodeData.value.conditions.splice(index, 1)
  handleUpdate()
}

// Branch Management
const addBranch = () => {
  nodeData.value.branches.push({
    percentage: 0,
    handleId: `branch_${nodeData.value.branches.length + 1}`
  })
  handleUpdate()
}

const removeBranch = (index: number) => {
  nodeData.value.branches.splice(index, 1)
  handleUpdate()
}

// Time Rule Management
const addTimeRule = () => {
  nodeData.value.timeRules.push({
    startTime: '09:00',
    endTime: '17:00',
    handleId: `time_${nodeData.value.timeRules.length + 1}`
  })
  handleUpdate()
}

const removeTimeRule = (index: number) => {
  nodeData.value.timeRules.splice(index, 1)
  handleUpdate()
}

const handleUpdate = () => {
  emit('update', {
    ...props.data,
    ...nodeData.value
  })
}

// Convert to Flow State
// 继续 SplitNode.vue 的 toFlowState
const toFlowState = () => {
  const transitions = []

  switch (nodeData.value.splitType) {
    case 'variable':
      transitions.push(
        ...nodeData.value.conditions.map(condition => ({
          event: 'condition_met',
          next: undefined,
          conditions: [{
            type: condition.operator,
            value: condition.value,
            variable: nodeData.value.variable
          }]
        }))
      )
      if (nodeData.value.defaultOutput) {
        transitions.push({
          event: 'default',
          next: undefined
        })
      }
      break;

    case 'random':
      transitions.push(
        ...nodeData.value.branches.map(branch => ({
          event: 'random',
          next: undefined,
          conditions: [{
            type: 'percentage',
            value: branch.percentage
          }]
        }))
      )
      break;

    case 'time':
      transitions.push(
        ...nodeData.value.timeRules.map(rule => ({
          event: 'time_matched',
          next: undefined,
          conditions: [{
            type: 'time_range',
            startTime: rule.startTime,
            endTime: rule.endTime
          }]
        }))
      )
      if (nodeData.value.defaultTimeOutput) {
        transitions.push({
          event: 'default',
          next: undefined
        })
      }
      break;
  }

  return {
    name: props.id,
    type: 'split',
    properties: {
      splitType: nodeData.value.splitType,
      variable: nodeData.value.variable,
      conditions: nodeData.value.conditions,
      branches: nodeData.value.branches,
      timeRules: nodeData.value.timeRules,
      defaultOutput: nodeData.value.defaultOutput,
      defaultTimeOutput: nodeData.value.defaultTimeOutput
    },
    transitions
  }
}
</script>