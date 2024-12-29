<template>
    <div>
      <h3 class="text-lg font-medium mb-4">Split Node Configuration</h3>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Conditions
        </label>
        <div v-for="(group, index) in data.conditions" :key="index" class="mb-2">
          <div>
            <label class="text-sm font-medium text-gray-700">Operator</label>
            <input v-model="group.operator" class="w-full rounded-md border-gray-300 mb-2" />
          </div>
          <div v-for="(condition, cIndex) in group.conditions" :key="cIndex" class="mb-2">
            <label class="text-sm font-medium text-gray-700">Variable</label>
            <input v-model="condition.variable" class="w-full rounded-md border-gray-300 mb-1" />
            <label class="text-sm font-medium text-gray-700">Operator</label>
            <input v-model="condition.operator" class="w-full rounded-md border-gray-300 mb-1" />
            <label class="text-sm font-medium text-gray-700">Value</label>
            <input v-model="condition.value" class="w-full rounded-md border-gray-300" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  
  interface Condition {
    variable: string
    operator: string
    value: string
  }
  
  interface ConditionGroup {
    operator: string
    conditions: Condition[]
  }
  
  const props = defineProps<{
    data: {
      conditions: ConditionGroup[]
    }
  }>()
  
  const emit = defineEmits(['update'])
  
  const data = ref(props.data)
  
  watch(data, (newData) => {
    emit('update', newData)
  })
  </script>
  
  <style scoped>
  /* Add any styles needed for the configuration panel */
  </style>