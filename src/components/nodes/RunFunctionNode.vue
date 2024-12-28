<!-- src/components/nodes/RunFunctionNode.vue -->
<template>
    <div class="relative">
      <div class="bg-white rounded-lg min-w-[300px] border-2" 
           :class="{ 'border-orange-500 ring-2 ring-orange-500': isSelected, 'border-gray-200': !isSelected }">
        <!-- Header -->
        <div class="bg-orange-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-medium text-base">{{ data.label || 'Run Function' }}</span>
            <button class="w-5 h-5 text-white/80 hover:text-white">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <button class="text-white/80 hover:text-white">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
        </div>
  
        <!-- Content -->
        <div class="p-4">
          <div class="space-y-4">
            <!-- Service Selection -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">SERVICE</label>
              <select 
                v-model="data.service"
                class="w-full px-3 py-2 border rounded text-sm"
                @change="updateNode"
              >
                <option value="">Select a service...</option>
                <option v-for="service in services" :key="service.sid" :value="service.sid">
                  {{ service.name }}
                </option>
              </select>
            </div>
  
            <!-- Environment -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">ENVIRONMENT</label>
              <select 
                v-model="data.environment"
                class="w-full px-3 py-2 border rounded text-sm"
                @change="updateNode"
              >
                <option value="dev">Development</option>
                <option value="stage">Staging</option>
                <option value="prod">Production</option>
              </select>
            </div>
  
            <!-- Function -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">FUNCTION</label>
              <select 
                v-model="data.function"
                class="w-full px-3 py-2 border rounded text-sm"
                @change="updateNode"
                :disabled="!data.service"
              >
                <option value="">Select a function...</option>
                <option v-for="func in functions" :key="func.sid" :value="func.sid">
                  {{ func.name }}
                </option>
              </select>
            </div>
  
            <!-- Parameters -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-xs font-medium text-gray-500">PARAMETERS</label>
                <button 
                  @click="addParameter"
                  class="text-orange-600 hover:text-orange-700 text-sm"
                >
                  Add Parameter
                </button>
              </div>
              <div class="space-y-2">
                <div 
                  v-for="(param, index) in data.parameters" 
                  :key="index"
                  class="flex items-center gap-2"
                >
                  <input
                    type="text"
                    v-model="param.key"
                    placeholder="Key"
                    class="flex-1 px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  />
                  <input
                    type="text"
                    v-model="param.value"
                    placeholder="Value"
                    class="flex-1 px-3 py-2 border rounded text-sm"
                    @change="updateNode"
                  />
                  <button 
                    @click="removeParameter(index)"
                    class="text-red-600 hover:text-red-700"
                  >
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
  
            <!-- URL Preview -->
            <div class="bg-gray-50 p-3 rounded">
              <div class="text-xs font-medium text-gray-500 mb-1">FUNCTION URL</div>
              <div class="text-sm font-mono text-gray-700 break-all">
                {{ getFunctionUrl }}
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Connection Points -->
      <Handle
        type="target"
        :position="Position.Top"
        class="w-3 h-3 !bg-orange-500"
      />
      <div class="flex justify-around mt-3">
        <div class="flex flex-col items-center">
          <Handle
            type="source"
            :position="Position.Bottom"
            id="success"
            class="w-3 h-3 !bg-orange-500"
          />
          <span class="mt-1 text-xs text-gray-500 bg-green-100 px-2 py-0.5 rounded">Success</span>
        </div>
        <div class="flex flex-col items-center">
          <Handle
            type="source"
            :position="Position.Bottom"
            id="failed"
            class="w-3 h-3 !bg-orange-500"
          />
          <span class="mt-1 text-xs text-gray-500 bg-red-100 px-2 py-0.5 rounded">Failed</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { Handle, Position } from '@vue-flow/core'
  
  const props = defineProps<{
    id: string
    data: {
      label?: string
      service?: string
      environment?: string
      function?: string
      parameters?: Array<{
        key: string
        value: string
      }>
    }
    isSelected?: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update', id: string, data: any): void
  }>()
  
  // 模拟服务和函数数据
  const services = [
    { sid: 'ZS123', name: 'Customer Service' },
    { sid: 'ZS456', name: 'Order Processing' }
  ]
  
  const functions = [
    { sid: 'ZF123', name: 'validateCustomer' },
    { sid: 'ZF456', name: 'processOrder' }
  ]
  
  // 计算Function URL
  const getFunctionUrl = computed(() => {
    if (!props.data.service || !props.data.function) {
      return 'https://[service-name]-[number].[region].twil.io/[function-path]'
    }
    
    const service = services.find(s => s.sid === props.data.service)
    const func = functions.find(f => f.sid === props.data.function)
    
    return `https://${service?.name.toLowerCase().replace(/\s+/g, '-')}-1234.twil.io/${func?.name}`
  })
  
  // 添加参数
  const addParameter = () => {
    const parameters = [...(props.data.parameters || [])]
    parameters.push({ key: '', value: '' })
    
    emit('update', props.id, {
      ...props.data,
      parameters
    })
  }
  
  // 移除参数
  const removeParameter = (index: number) => {
    const parameters = [...(props.data.parameters || [])]
    parameters.splice(index, 1)
    
    emit('update', props.id, {
      ...props.data,
      parameters
    })
  }
  
  // 更新节点数据
  const updateNode = () => {
    emit('update', props.id, {
      ...props.data
    })
  }
  </script>