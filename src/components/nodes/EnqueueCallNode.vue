// src/components/nodes/EnqueueCallNode.vue
<template>
  <BaseNode
    type="enqueue_call"
    :title="nodeData.label"
    :is-selected="isSelected"
    :is-executing="isExecuting"
    :has-error="hasError"
  >
    <template #icon>
      <PhoneCallIcon class="w-5 h-5 text-teal-500" />
    </template>

    <template #default>
      <div class="p-4 space-y-4">
        <!-- Queue Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Queue Name</label>
          <select
            v-model="nodeData.queueName"
            class="mt-1 block w-full rounded-md border-gray-300"
            @change="handleUpdate"
          >
            <option value="">Select a queue...</option>
            <option v-for="queue in queueOptions" :key="queue.id" :value="queue.id">
              {{ queue.name }}
            </option>
          </select>
        </div>

        <!-- Queue Priority -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Priority</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              v-model.number="nodeData.priority"
              min="1"
              max="100"
              class="block w-full rounded-md border-gray-300"
              @change="handleUpdate"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <InfoIcon 
                class="h-4 w-4 text-gray-400" 
                @mouseenter="showPriorityInfo = true"
                @mouseleave="showPriorityInfo = false"
              />
            </div>
          </div>
          <p v-if="showPriorityInfo" class="mt-1 text-sm text-gray-500">
            Higher numbers indicate higher priority (1-100)
          </p>
        </div>

        <!-- Wait Music Configuration -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Wait Music</label>
          <div class="space-y-3">
            <div>
              <select
                v-model="nodeData.waitMusicType"
                class="block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              >
                <option value="default">Default Music</option>
                <option value="custom">Custom URL</option>
                <option value="twiml">TwiML</option>
              </select>
            </div>

            <div v-if="nodeData.waitMusicType === 'custom'">
              <input
                type="url"
                v-model="nodeData.waitMusicUrl"
                placeholder="https://example.com/wait-music.mp3"
                class="block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              />
            </div>

            <div v-if="nodeData.waitMusicType === 'twiml'">
              <textarea
                v-model="nodeData.waitMusicTwiml"
                rows="3"
                class="block w-full rounded-md border-gray-300 font-mono"
                placeholder="<Response><Play>...</Play></Response>"
                @change="handleUpdate"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Queue Settings -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-900">Queue Settings</h3>
          
          <!-- Wait Time -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-700">Max Wait Time</label>
              <input
                type="number"
                v-model.number="nodeData.maxWaitTime"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-700">Time Unit</label>
              <select
                v-model="nodeData.timeUnit"
                class="mt-1 block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
              </select>
            </div>
          </div>

          <!-- Queue Options -->
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="nodeData.announcePosition"
                class="rounded border-gray-300 text-teal-600"
                @change="handleUpdate"
              />
              <span class="ml-2 text-sm text-gray-700">Announce position in queue</span>
            </label>

            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="nodeData.announceWaitTime"
                class="rounded border-gray-300 text-teal-600"
                @change="handleUpdate"
              />
              <span class="ml-2 text-sm text-gray-700">Announce estimated wait time</span>
            </label>

            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="nodeData.allowCallback"
                class="rounded border-gray-300 text-teal-600"
                @change="handleUpdate"
              />
              <span class="ml-2 text-sm text-gray-700">Allow callback option</span>
            </label>
          </div>

          <!-- Announcement Settings -->
          <div v-if="nodeData.announcePosition || nodeData.announceWaitTime">
            <label class="block text-sm text-gray-700">Announcement Interval (seconds)</label>
            <input
              type="number"
              v-model.number="nodeData.announceInterval"
              min="30"
              class="mt-1 block w-full rounded-md border-gray-300"
              @change="handleUpdate"
            />
          </div>
        </div>

        <!-- Agent Selection -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 mb-2">Agent Selection</h3>
          <select
            v-model="nodeData.agentSelection"
            class="block w-full rounded-md border-gray-300"
            @change="handleUpdate"
          >
            <option value="longest_idle">Longest Idle</option>
            <option value="round_robin">Round Robin</option>
            <option value="skills_based">Skills Based</option>
          </select>

          <div v-if="nodeData.agentSelection === 'skills_based'" class="mt-2">
            <label class="block text-sm text-gray-700">Required Skills</label>
            <select
              v-model="nodeData.requiredSkills"
              multiple
              class="mt-1 block w-full rounded-md border-gray-300"
              @change="handleUpdate"
            >
              <option v-for="skill in availableSkills" :key="skill.id" :value="skill.id">
                {{ skill.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Callback Configuration -->
        <div v-if="nodeData.allowCallback">
          <h3 class="text-sm font-medium text-gray-900 mb-2">Callback Settings</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm text-gray-700">Callback Message</label>
              <textarea
                v-model="nodeData.callbackMessage"
                rows="2"
                class="mt-1 block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-700">Min Callback Delay</label>
                <input
                  type="number"
                  v-model.number="nodeData.minCallbackDelay"
                  min="0"
                  class="mt-1 block w-full rounded-md border-gray-300"
                  @change="handleUpdate"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-700">Max Callback Delay</label>
                <input
                  type="number"
                  v-model.number="nodeData.maxCallbackDelay"
                  min="0"
                  class="mt-1 block w-full rounded-md border-gray-300"
                  @change="handleUpdate"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #handles>
      <Handle
        type="source"
        :position="Position.Right"
        id="enqueued"
        class="handle-success"
      >
        <span class="handle-label">Enqueued</span>
      </Handle>
      <Handle
        type="source"
        :position="Position.Right"
        id="connect"
        class="handle-connect"
      >
        <span class="handle-label">Connected</span>
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
        id="callback"
        v-if="nodeData.allowCallback"
        class="handle-info"
      >
        <span class="handle-label">Callback</span>
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

<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { PhoneCall, Info } from 'lucide-vue-next'
import BaseNode from './BaseNode.vue'

// 继续 EnqueueCallNode.vue 的 script 部分
const props = defineProps<{
  id: string
  data: any
  isSelected?: boolean
}>()

const emit = defineEmits(['update'])

// 队列选项示例数据
const queueOptions = [
  { id: 'sales', name: 'Sales Queue' },
  { id: 'support', name: 'Support Queue' },
  { id: 'billing', name: 'Billing Queue' },
  { id: 'technical', name: 'Technical Support' }
]

// 技能选项示例数据
const availableSkills = [
  { id: 'english', name: 'English' },
  { id: 'spanish', name: 'Spanish' },
  { id: 'technical', name: 'Technical Support' },
  { id: 'billing', name: 'Billing Support' },
  { id: 'sales', name: 'Sales' }
]

// 节点数据
const nodeData = ref({
  label: props.data.label || 'Enqueue Call',
  queueName: props.data.queueName || '',
  priority: props.data.priority || 10,
  
  // 等待音乐配置
  waitMusicType: props.data.waitMusicType || 'default',
  waitMusicUrl: props.data.waitMusicUrl || '',
  waitMusicTwiml: props.data.waitMusicTwiml || '',
  
  // 队列设置
  maxWaitTime: props.data.maxWaitTime || 300,
  timeUnit: props.data.timeUnit || 'seconds',
  announcePosition: props.data.announcePosition || false,
  announceWaitTime: props.data.announceWaitTime || false,
  announceInterval: props.data.announceInterval || 60,
  
  // 代理选择
  agentSelection: props.data.agentSelection || 'longest_idle',
  requiredSkills: props.data.requiredSkills || [],
  
  // 回拨设置
  allowCallback: props.data.allowCallback || false,
  callbackMessage: props.data.callbackMessage || 'We will call you back as soon as an agent is available.',
  minCallbackDelay: props.data.minCallbackDelay || 5,
  maxCallbackDelay: props.data.maxCallbackDelay || 60
})

const isExecuting = ref(false)
const hasError = ref(false)
const showPriorityInfo = ref(false)

// 方法
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
    type: 'enqueue_call',
    properties: {
      queueName: nodeData.value.queueName,
      priority: nodeData.value.priority,
      waitMusic: {
        type: nodeData.value.waitMusicType,
        url: nodeData.value.waitMusicUrl,
        twiml: nodeData.value.waitMusicTwiml
      },
      queueSettings: {
        maxWaitTime: nodeData.value.maxWaitTime,
        timeUnit: nodeData.value.timeUnit,
        announcePosition: nodeData.value.announcePosition,
        announceWaitTime: nodeData.value.announceWaitTime,
        announceInterval: nodeData.value.announceInterval
      },
      agentSelection: {
        strategy: nodeData.value.agentSelection,
        requiredSkills: nodeData.value.requiredSkills
      },
      callback: nodeData.value.allowCallback ? {
        enabled: true,
        message: nodeData.value.callbackMessage,
        minDelay: nodeData.value.minCallbackDelay,
        maxDelay: nodeData.value.maxCallbackDelay
      } : {
        enabled: false
      }
    },
    transitions: [
      { event: 'enqueued', next: undefined },
      { event: 'connect', next: undefined },
      { event: 'timeout', next: undefined },
      ...(nodeData.value.allowCallback ? [{ event: 'callback', next: undefined }] : []),
      { event: 'error', next: undefined }
    ]
  }
}
</script>

<style scoped>
.handle-connect {
  @apply bg-blue-500;
}

.handle-info {
  @apply bg-cyan-500;
}

.multiselect {
  @apply text-sm;
}
</style>