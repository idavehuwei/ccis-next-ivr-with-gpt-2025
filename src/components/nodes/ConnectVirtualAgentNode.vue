// src/components/nodes/ConnectVirtualAgentNode.vue
<template>
  <BaseNode
    type="connect_virtual_agent"
    :title="nodeData.label"
    :is-selected="isSelected"
    :is-executing="isExecuting"
    :has-error="hasError"
  >
    <template #icon>
      <BotIcon class="w-5 h-5 text-indigo-500" />
    </template>

    <template #default>
      <div class="p-4 space-y-4">
        <!-- Virtual Agent Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Virtual Agent</label>
          <select
            v-model="nodeData.agentId"
            class="mt-1 block w-full rounded-md border-gray-300"
            @change="handleUpdate"
          >
            <option value="">Select an agent...</option>
            <option v-for="agent in virtualAgents" :key="agent.id" :value="agent.id">
              {{ agent.name }}
            </option>
          </select>
        </div>

        <!-- Language Settings -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Language</label>
          <select
            v-model="nodeData.language"
            class="mt-1 block w-full rounded-md border-gray-300"
            @change="handleUpdate"
          >
            <option value="en-US">English (US)</option>
            <option value="es-ES">Spanish (Spain)</option>
            <option value="fr-FR">French (France)</option>
            <option value="de-DE">German</option>
            <option value="zh-CN">Chinese (Simplified)</option>
            <option value="ja-JP">Japanese</option>
          </select>
        </div>

        <!-- NLP Settings -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">NLP Settings</label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="nodeData.enableTranscription"
                class="rounded border-gray-300 text-indigo-600"
                @change="handleUpdate"
              />
              <span class="ml-2 text-sm text-gray-700">Enable Speech-to-Text</span>
            </label>
            
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="nodeData.enableSentimentAnalysis"
                class="rounded border-gray-300 text-indigo-600"
                @change="handleUpdate"
              />
              <span class="ml-2 text-sm text-gray-700">Enable Sentiment Analysis</span>
            </label>
          </div>
        </div>

        <!-- Context Variables -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700">Context Variables</label>
            <button
              @click="addContextVariable"
              class="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Add Variable
            </button>
          </div>
          
          <div class="space-y-2">
            <div
              v-for="(variable, index) in nodeData.contextVariables"
              :key="index"
              class="flex items-center gap-2"
            >
              <input
                v-model="variable.key"
                type="text"
                placeholder="Variable name"
                class="flex-1 rounded-md border-gray-300"
                @change="handleUpdate"
              />
              <input
                v-model="variable.value"
                type="text"
                placeholder="Value"
                class="flex-1 rounded-md border-gray-300"
                @change="handleUpdate"
              />
              <button
                @click="removeContextVariable(index)"
                class="text-red-500 hover:text-red-700"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Handoff Settings -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Handoff Settings</label>
          <div class="space-y-4">
            <!-- Handoff Conditions -->
            <div>
              <select
                v-model="nodeData.handoffTrigger"
                class="block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              >
                <option value="never">Never</option>
                <option value="customer_request">On Customer Request</option>
                <option value="sentiment">On Negative Sentiment</option>
                <option value="no_resolution">On No Resolution</option>
                <option value="custom">Custom Condition</option>
              </select>
            </div>

            <!-- Custom Handoff Condition -->
            <div v-if="nodeData.handoffTrigger === 'custom'">
              <textarea
                v-model="nodeData.customHandoffCondition"
                rows="3"
                class="block w-full rounded-md border-gray-300"
                placeholder="Enter custom handoff condition..."
                @change="handleUpdate"
              ></textarea>
            </div>

            <!-- Handoff Target -->
            <div v-if="nodeData.handoffTrigger !== 'never'">
              <label class="block text-sm text-gray-700">Handoff Target</label>
              <select
                v-model="nodeData.handoffTarget"
                class="mt-1 block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              >
                <option value="queue">Queue</option>
                <option value="agent">Specific Agent</option>
                <option value="skill">Skill Based</option>
              </select>

              <!-- Target-specific settings -->
              <div class="mt-2">
                <template v-if="nodeData.handoffTarget === 'queue'">
                  <select
                    v-model="nodeData.handoffQueue"
                    class="block w-full rounded-md border-gray-300"
                    @change="handleUpdate"
                  >
                    <option v-for="queue in queueOptions" :key="queue.id" :value="queue.id">
                      {{ queue.name }}
                    </option>
                  </select>
                </template>

                <template v-if="nodeData.handoffTarget === 'skill'">
                  <select
                    v-model="nodeData.handoffSkills"
                    multiple
                    class="block w-full rounded-md border-gray-300"
                    @change="handleUpdate"
                  >
                    <option v-for="skill in availableSkills" :key="skill.id" :value="skill.id">
                      {{ skill.name }}
                    </option>
                  </select>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeout Settings -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Timeout Settings</label>
          <div class="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label class="block text-sm text-gray-700">Max Duration</label>
              <input
                type="number"
                v-model.number="nodeData.maxDuration"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-700">No Input Timeout</label>
              <input
                type="number"
                v-model.number="nodeData.noInputTimeout"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #handles>
      <Handle
        type="source"
        :position="Position.Right"
        id="completed"
        class="handle-success"
      >
        <span class="handle-label">Completed</span>
      </Handle>
      <Handle
        type="source"
        :position="Position.Right"
        id="handoff"
        class="handle-info"
      >
        <span class="handle-label">Handoff</span>
      </Handle>
      <Handle
        type="source"
        :position="Position.Right"
        id="timeout"
        class="handle-warning"
      >
        <span class="handle-label">Timeout</span>
      </Handle>
      <Handle
        type="source"
        :position="Position.Right"
        id="error"
        class="handle-error"
      >
        <span class="handle-label">Error</span>
      </Handle>
    </template>
  </BaseNode>
</template>


// 继续 ConnectVirtualAgentNode.vue 的 script 部分

<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { Bot, Trash } from 'lucide-vue-next'
import BaseNode from './BaseNode.vue'

const props = defineProps<{
  id: string
  data: any
  isSelected?: boolean
}>()

const emit = defineEmits(['update'])

// 虚拟代理列表
const virtualAgents = [
  { id: 'customer_support', name: 'Customer Support Bot' },
  { id: 'sales_assistant', name: 'Sales Assistant' },
  { id: 'tech_support', name: 'Technical Support Bot' },
  { id: 'booking_agent', name: 'Booking Assistant' }
]

// 队列选项
const queueOptions = [
  { id: 'general_support', name: 'General Support' },
  { id: 'technical', name: 'Technical Support' },
  { id: 'sales', name: 'Sales Team' },
  { id: 'premium', name: 'Premium Support' }
]

// 技能选项
const availableSkills = [
  { id: 'technical', name: 'Technical Support' },
  { id: 'sales', name: 'Sales' },
  { id: 'billing', name: 'Billing' },
  { id: 'english', name: 'English' },
  { id: 'spanish', name: 'Spanish' }
]

// 节点数据
const nodeData = ref({
  label: props.data.label || 'Connect Virtual Agent',
  agentId: props.data.agentId || '',
  language: props.data.language || 'en-US',

  // NLP 设置
  enableTranscription: props.data.enableTranscription || false,
  enableSentimentAnalysis: props.data.enableSentimentAnalysis || false,

  // 上下文变量
  contextVariables: props.data.contextVariables || [],

  // 转接设置
  handoffTrigger: props.data.handoffTrigger || 'never',
  customHandoffCondition: props.data.customHandoffCondition || '',
  handoffTarget: props.data.handoffTarget || 'queue',
  handoffQueue: props.data.handoffQueue || '',
  handoffSkills: props.data.handoffSkills || [],

  // 超时设置
  maxDuration: props.data.maxDuration || 1800, // 30分钟
  noInputTimeout: props.data.noInputTimeout || 60, // 60秒

  // 执行状态
  status: props.data.status || 'idle',
  errorMessage: props.data.errorMessage || ''
})

const isExecuting = ref(false)
const hasError = ref(false)

// 方法
const addContextVariable = () => {
  nodeData.value.contextVariables.push({
    key: '',
    value: ''
  })
  handleUpdate()
}

const removeContextVariable = (index: number) => {
  nodeData.value.contextVariables.splice(index, 1)
  handleUpdate()
}

const handleUpdate = () => {
  emit('update', {
    ...props.data,
    ...nodeData.value
  })
}

// 转换为 Flow State
const toFlowState = () => {
  return {
    name: props.id,
    type: 'connect_virtual_agent',
    properties: {
      agentId: nodeData.value.agentId,
      language: nodeData.value.language,
      nlpSettings: {
        enableTranscription: nodeData.value.enableTranscription,
        enableSentimentAnalysis: nodeData.value.enableSentimentAnalysis
      },
      contextVariables: nodeData.value.contextVariables.reduce((acc: Record<string, string>, curr: any) => {
        if (curr.key && curr.value) {
          acc[curr.key] = curr.value
        }
        return acc
      }, {}),
      handoff: {
        trigger: nodeData.value.handoffTrigger,
        condition: nodeData.value.handoffTrigger === 'custom' 
          ? nodeData.value.customHandoffCondition 
          : null,
        target: {
          type: nodeData.value.handoffTarget,
          queue: nodeData.value.handoffQueue,
          skills: nodeData.value.handoffSkills
        }
      },
      timeouts: {
        maxDuration: nodeData.value.maxDuration,
        noInput: nodeData.value.noInputTimeout
      }
    },
    transitions: [
      { event: 'completed', next: undefined },
      { event: 'handoff', next: undefined },
      { event: 'timeout', next: undefined },
      { event: 'error', next: undefined }
    ]
  }
}

// 用于监控虚拟代理状态的方法
const monitorAgentStatus = async () => {
  try {
    isExecuting.value = true
    hasError.value = false
    // 实际实现中这里会与虚拟代理服务通信
    // 监控会话状态、意图识别结果、情感分析等
  } catch (error) {
    hasError.value = true
    nodeData.value.errorMessage = error.message
  } finally {
    isExecuting.value = false
  }
}

// 导出一些方法供父组件使用
defineExpose({
  monitorAgentStatus,
  getAgentStatus: () => nodeData.value.status,
  resetAgent: () => {
    nodeData.value.status = 'idle'
    nodeData.value.errorMessage = ''
    hasError.value = false
  }
})
</script>

<style scoped>
.handle-info {
  @apply bg-blue-500;
}

.handle-warning {
  @apply bg-yellow-500;
}

.multiselect {
  @apply text-sm;
}

.handoff-active {
  @apply border-blue-500 ring-2 ring-blue-200;
}
</style>
