<!-- src/components/nodes/CapturePaymentsNode.vue -->
<template>
    <div class="relative">
      <div class="bg-white rounded-lg min-w-[300px] border-2" 
           :class="{ 'border-emerald-500 ring-2 ring-emerald-500': isSelected, 'border-gray-200': !isSelected }">
        <!-- Header -->
        <div class="bg-emerald-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 10h18M7 15h1m4 0h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-medium text-base">{{ nodeData.label || 'Capture Payments' }}</span>
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
            <!-- Payment Amount -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">AMOUNT</label>
                <input
                  type="number"
                  v-model.number="nodeData.amount"
                  step="0.01"
                  min="0"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">CURRENCY</label>
                <select
                  v-model="nodeData.currency"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
  
            <!-- Payment Description -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">DESCRIPTION</label>
              <input
                type="text"
                v-model="nodeData.description"
                placeholder="Payment for..."
                class="w-full px-3 py-2 border rounded text-sm"
                @change="updateNode"
              />
            </div>
  
            <!-- Security Settings -->
            <div class="bg-gray-50 p-4 rounded-lg space-y-4">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">SECURITY SETTINGS</label>
              </div>
  
              <!-- Payment Methods -->
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">ALLOWED PAYMENT METHODS</label>
                <div class="space-y-2">
                  <label class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      v-model="nodeData.allowedMethods.creditCard"
                      class="text-emerald-500 rounded focus:ring-emerald-500"
                      @change="updateNode"
                    />
                    <span class="text-sm text-gray-700">Credit Card</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      v-model="nodeData.allowedMethods.bankTransfer"
                      class="text-emerald-500 rounded focus:ring-emerald-500"
                      @change="updateNode"
                    />
                    <span class="text-sm text-gray-700">Bank Transfer</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      v-model="nodeData.allowedMethods.digitalWallet"
                      class="text-emerald-500 rounded focus:ring-emerald-500"
                      @change="updateNode"
                    />
                    <span class="text-sm text-gray-700">Digital Wallet</span>
                  </label>
                </div>
              </div>
  
              <!-- Validation Settings -->
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-2">VALIDATION</label>
                <div class="space-y-2">
                  <label class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      v-model="nodeData.validation.address"
                      class="text-emerald-500 rounded focus:ring-emerald-500"
                      @change="updateNode"
                    />
                    <span class="text-sm text-gray-700">Address Verification</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      v-model="nodeData.validation.cvv"
                      class="text-emerald-500 rounded focus:ring-emerald-500"
                      @change="updateNode"
                    />
                    <span class="text-sm text-gray-700">Require CVV</span>
                  </label>
                </div>
              </div>
  
              <!-- Retry Settings -->
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">MAX ATTEMPTS</label>
                <input
                  type="number"
                  v-model.number="nodeData.maxAttempts"
                  min="1"
                  max="5"
                  class="w-full px-3 py-2 border rounded text-sm"
                  @change="updateNode"
                />
              </div>
            </div>
  
            <!-- Payment Message -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">PAYMENT PROMPT</label>
              <textarea
                v-model="nodeData.paymentPrompt"
                rows="2"
                placeholder="Please enter your payment information..."
                class="w-full px-3 py-2 border rounded text-sm"
                @change="updateNode"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Connection Points -->
      <Handle
        type="target"
        :position="Position.Top"
        class="w-3 h-3 !bg-emerald-500"
      />
      
      <!-- Output Handles -->
      <div class="flex justify-around mt-3">
        <div v-for="output in outputs" 
             :key="output.id" 
             class="flex flex-col items-center">
          <Handle
            type="source"
            :position="Position.Bottom"
            :id="output.id"
            class="w-3 h-3 !bg-emerald-500 cursor-pointer hover:scale-110 transition-transform"
          />
          <span 
            class="mt-1 text-xs text-gray-500 px-2 py-0.5 rounded"
            :class="output.class"
          >
            {{ output.label }}
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { Handle, Position } from '@vue-flow/core'
  
  const props = defineProps<{
    id: string
    data: {
      label?: string
      amount?: number
      currency?: string
      description?: string
      paymentPrompt?: string
      maxAttempts?: number
      allowedMethods?: {
        creditCard: boolean
        bankTransfer: boolean
        digitalWallet: boolean
      }
      validation?: {
        address: boolean
        cvv: boolean
      }
    }
    isSelected?: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update', id: string, data: any): void
  }>()
  
  // 默认值
  const defaultData = {
    label: 'Capture Payments',
    amount: 0,
    currency: 'USD',
    description: '',
    paymentPrompt: '',
    maxAttempts: 3,
    allowedMethods: {
      creditCard: true,
      bankTransfer: false,
      digitalWallet: false
    },
    validation: {
      address: false,
      cvv: true
    }
  }
  
  // 使用ref来存储节点数据
  const nodeData = ref({...defaultData})
  
  // 监听props.data的变化
  watch(() => props.data, (newData) => {
    nodeData.value = {
      ...defaultData,
      ...newData
    }
  }, { immediate: true, deep: true })
  
  // Output connection points configuration
  const outputs = [
    { 
      id: 'success', 
      label: 'Success',
      class: 'bg-green-100 text-green-700'
    },
    { 
      id: 'declined', 
      label: 'Declined',
      class: 'bg-yellow-100 text-yellow-700'
    },
    { 
      id: 'max_attempts', 
      label: 'Max Attempts',
      class: 'bg-orange-100 text-orange-700'
    },
    { 
      id: 'error', 
      label: 'Error',
      class: 'bg-red-100 text-red-700'
    }
  ]
  
  // Update node data
  const updateNode = () => {
    emit('update', props.id, nodeData.value)
  }
  </script>