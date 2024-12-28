<!-- src/components/widget-configs/TriggerConfig.vue -->
<template>
    <div class="p-4 space-y-4">
      <!-- Widget Name -->
      <div>
        <label class="block text-sm font-medium text-gray-500 mb-1">
          WIDGET NAME <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          v-model="nodeData.label"
          class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
          @change="updateNode"
        />
      </div>
  
      <!-- Trigger Type -->
      <div>
        <label class="block text-sm font-medium text-gray-500 mb-1">TRIGGER TYPE</label>
        <select
          v-model="nodeData.triggerType"
          class="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
          @change="updateNode"
        >
          <option value="incoming_call">Incoming Call</option>
          <option value="incoming_message">Incoming Message</option>
          <option value="api">API Trigger</option>
          <option value="conditional">Conditional</option>
          <option value="subflow">Subflow</option>
        </select>
      </div>
  
      <!-- Type-specific Configuration -->
      <div v-if="nodeData.triggerType === 'conditional'" class="space-y-2">
        <label class="block text-sm font-medium text-gray-500">CONDITIONS</label>
        <div v-for="(condition, index) in nodeData.conditions" :key="index"
             class="space-y-2">
          <!-- Condition Configuration -->
          <div class="grid grid-cols-3 gap-2">
            <select
              v-model="condition.variable"
              class="px-3 py-2 border rounded text-sm"
              @change="updateNode"
            >
              <option value="">Select variable</option>
              <option v-for="variable in availableVariables" 
                      :key="variable"
                      :value="variable">
                {{ variable }}
              </option>
            </select>
            <select
              v-model="condition.operator"
              class="px-3 py-2 border rounded text-sm"
              @change="updateNode"
            >
              <option value="equals">equals</option>
              <option value="contains">contains</option>
              <option value="starts_with">starts with</option>
              <option value="greater_than">greater than</option>
              <option value="less_than">less than</option>
            </select>
            <input
              type="text"
              v-model="condition.value"
              placeholder="Value"
              class="px-3 py-2 border rounded text-sm"
              @change="updateNode"
            />
          </div>
          <button
            @click="removeCondition(index)"
            class="text-red-500 hover:text-red-600 text-sm"
          >
            Remove
          </button>
        </div>
        <button
          @click="addCondition"
          class="text-blue-600 hover:text-blue-700 text-sm"
        >
          + Add Condition
        </button>
      </div>
  
      <!-- Subflow Configuration -->
      <div v-if="nodeData.triggerType === 'subflow'" class="space-y-2">
        <label class="block text-sm font-medium text-gray-500">SUBFLOW</label>
        <select
          v-model="nodeData.subflowId"
          class="w-full px-3 py-2 border rounded text-sm"
          @change="updateNode"
        >
          <option value="">Select subflow</option>
          <option v-for="flow in availableFlows" 
                  :key="flow.id"
                  :value="flow.id">
            {{ flow.name }}
          </option>
        </select>
      </div>
   </div>
</template>