<!-- src/components/NodeProperties.vue -->
<template>
  <div class="p-4 space-y-4">
    <!-- 基本属性 -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        Node Name
      </label>
      <input
        type="text"
        v-model="localNode.name"
        class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        @change="updateNode"
      />
    </div>

    <!-- 节点特定属性 -->
    <div v-if="node.type === 'gather_input'" class="space-y-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Prompt Message
        </label>
        <textarea
          v-model="localNode.data.promptMessage"
          class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          rows="3"
          @change="updateNode"
        ></textarea>
      </div>
      
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Input Type
        </label>
        <select
          v-model="localNode.data.inputType"
          class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          @change="updateNode"
        >
          <option value="dtmf">DTMF (Keypad)</option>
          <option value="speech">Speech</option>
          <option value="both">Both</option>
        </select>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Timeout (seconds)
        </label>
        <input
          type="number"
          v-model.number="localNode.data.timeout"
          class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          min="1"
          max="60"
          @change="updateNode"
        />
      </div>
    </div>

    <div v-if="node.type === 'connect_call'" class="space-y-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          v-model="localNode.data.phoneNumber"
          class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          @change="updateNode"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Timeout (seconds)
        </label>
        <input
          type="number"
          v-model.number="localNode.data.timeout"
          class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          min="10"
          max="300"
          @change="updateNode"
        />
      </div>
    </div>

    <div v-if="node.type === 'split'" class="space-y-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Split Type
        </label>
        <select
          v-model="localNode.data.splitType"
          class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          @change="updateNode"
        >
          <option value="input">User Input</option>
          <option value="time">Time of Day</option>
          <option value="custom">Custom Logic</option>
        </select>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Conditions
        </label>
        <div 
          v-for="(condition, index) in localNode.data.conditions" 
          :key="index"
          class="flex gap-2 mt-2"
        >
          <input
            type="text"
            v-model="condition.value"
            class="flex-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Condition value"
          />
          <button
            @click="removeCondition(index)"
            class="px-2 py-1 text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
        <button
          @click="addCondition"
          class="mt-2 px-4 py-2 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
        >
          Add Condition
        </button>
      </div>
    </div>

    <div v-if="node.type === 'trigger'" class="space-y-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Trigger Type
        </label>
        <select
          v-model="localNode.data.triggerType"
          class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          @change="updateNode"
        >
          <option value="incoming_call">Incoming Call</option>
          <option value="incoming_message">Incoming Message</option>
          <option value="rest_api">REST API</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { IVRNode } from '@/types'

const props = defineProps<{
  node: IVRNode
}>()

const emit = defineEmits<{
  (e: 'update', node: IVRNode): void
}>()

// 创建本地响应式副本
const localNode = ref<IVRNode>({
  ...props.node,
  data: { ...props.node.data }
})

// 监听属性变化
watch(
  () => props.node,
  (newNode) => {
    localNode.value = {
      ...newNode,
      data: { ...newNode.data }
    }
  },
  { deep: true }
)

// 更新节点
const updateNode = () => {
  emit('update', localNode.value)
}

// 添加分支条件
const addCondition = () => {
  if (!localNode.value.data.conditions) {
    localNode.value.data.conditions = []
  }
  localNode.value.data.conditions.push({
    value: '',
    target: ''
  })
  updateNode()
}

// 移除分支条件
const removeCondition = (index: number) => {
  localNode.value.data.conditions?.splice(index, 1)
  updateNode()
}
</script>
