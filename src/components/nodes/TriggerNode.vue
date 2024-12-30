// src/components/nodes/TriggerNode.vue
<template>
  <BaseNode
    type="trigger"
    :title="nodeData.label"
    :is-selected="isSelected"
    :is-executing="isExecuting"
    :has-error="hasError"
    @update="handleUpdate"
  >
    <template #icon>
      <FlashIcon class="w-5 h-5 text-red-500" />
    </template>

    <template #default>
      <div class="p-4 space-y-4">
        <!-- Trigger Type Selection -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="type in triggerTypes"
            :key="type.value"
            :class="[
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
              nodeData.triggerType === type.value 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            @click="selectTriggerType(type.value)"
          >
            <component 
              :is="type.icon" 
              class="w-5 h-5"
              :class="nodeData.triggerType === type.value ? 'text-white' : 'text-gray-500'"
            />
            <span>{{ type.label }}</span>
          </button>
        </div>

        <!-- Channel Selection (for message/call triggers) -->
        <template v-if="['incoming_message', 'incoming_call'].includes(nodeData.triggerType)">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Channel</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="channel in availableChannels"
                :key="channel.value"
                :class="[
                  'flex items-center justify-center p-3 border rounded-lg transition-colors',
                  nodeData.channel === channel.value
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:bg-gray-50'
                ]"
                @click="selectChannel(channel.value)"
              >
                <component :is="channel.icon" class="w-5 h-5 mr-2" />
                <span>{{ channel.label }}</span>
              </button>
            </div>
          </div>
        </template>

        <!-- Webhook Configuration -->
        <template v-if="nodeData.triggerType === 'webhook'">
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700">Webhook URL</label>
              <input
                v-model="nodeData.webhookConfig.url"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300"
                placeholder="https://your-domain.com/webhook"
                @change="handleUpdate"
              />
            </div>

            <!-- Authentication -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Authentication</label>
              <select
                v-model="nodeData.webhookConfig.authType"
                class="mt-1 block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              >
                <option value="">No Authentication</option>
                <option value="basic">Basic Auth</option>
                <option value="bearer">Bearer Token</option>
              </select>

              <template v-if="nodeData.webhookConfig.authType === 'basic'">
                <input
                  v-model="nodeData.webhookConfig.username"
                  type="text"
                  class="mt-2 block w-full rounded-md border-gray-300"
                  placeholder="Username"
                  @change="handleUpdate"
                />
                <input
                  v-model="nodeData.webhookConfig.password"
                  type="password"
                  class="mt-2 block w-full rounded-md border-gray-300"
                  placeholder="Password"
                  @change="handleUpdate"
                />
              </template>

              <template v-if="nodeData.webhookConfig.authType === 'bearer'">
                <input
                  v-model="nodeData.webhookConfig.token"
                  type="text"
                  class="mt-2 block w-full rounded-md border-gray-300"
                  placeholder="Bearer Token"
                  @change="handleUpdate"
                />
              </template>
            </div>
          </div>
        </template>

        <!-- Schedule Configuration -->
        <template v-if="nodeData.triggerType === 'schedule'">
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700">Schedule Type</label>
              <select
                v-model="nodeData.scheduleConfig.type"
                class="mt-1 block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              >
                <option value="interval">Interval</option>
                <option value="cron">Cron Expression</option>
                <option value="fixed">Fixed Time</option>
              </select>
            </div>

            <template v-if="nodeData.scheduleConfig.type === 'interval'">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Interval</label>
                  <input
                    v-model.number="nodeData.scheduleConfig.interval"
                    type="number"
                    min="1"
                    class="mt-1 block w-full rounded-md border-gray-300"
                    @change="handleUpdate"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Unit</label>
                  <select
                    v-model="nodeData.scheduleConfig.unit"
                    class="mt-1 block w-full rounded-md border-gray-300"
                    @change="handleUpdate"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>
            </template>

            <template v-if="nodeData.scheduleConfig.type === 'cron'">
              <div>
                <label class="block text-sm font-medium text-gray-700">Cron Expression</label>
                <input
                  v-model="nodeData.scheduleConfig.cron"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300"
                  placeholder="* * * * *"
                  @change="handleUpdate"
                />
              </div>
            </template>

            <template v-if="nodeData.scheduleConfig.type === 'fixed'">
              <div>
                <label class="block text-sm font-medium text-gray-700">Fixed Time</label>
                <input
                  v-model="nodeData.scheduleConfig.time"
                  type="datetime-local"
                  class="mt-1 block w-full rounded-md border-gray-300"
                  @change="handleUpdate"
                />
              </div>
            </template>
          </div>
        </template>
      </div>
    </template>

    <template #handles>
      <Handle
        type="source"
        :position="Position.Bottom"
        id="success"
        class="handle-success"
      >
        <span class="handle-label">Success</span>
      </Handle>
    </template>
  </BaseNode>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { Flash, MessageCircle, Phone, Webhook, Clock } from 'lucide-vue-next'
import BaseNode from './BaseNode.vue'

const props = defineProps<{
  id: string
  data: any
  isSelected?: boolean
}>()

const emit = defineEmits(['update'])

// Trigger types configuration
const triggerTypes = [
  {
    value: 'incoming_message',
    label: 'Incoming Message',
    icon: MessageCircle
  },
  {
    value: 'incoming_call',
    label: 'Incoming Call',
    icon: Phone
  },
  {
    value: 'webhook',
    label: 'Webhook',
    icon: Webhook
  },
  {
    value: 'schedule',
    label: 'Schedule',
    icon: Clock
  }
]

// Available channels
const availableChannels = [
  {
    value: 'sms',
    label: 'SMS',
    icon: MessageCircle
  },
  {
    value: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle
  },
  {
    value: 'voice',
    label: 'Voice',
    icon: Phone
  }
]

// Node data with reactive state
const nodeData = ref({
  label: props.data.label || 'Trigger',
  triggerType: props.data.triggerType || 'incoming_message',
  channel: props.data.channel || 'sms',
  webhookConfig: props.data.webhookConfig || {
    url: '',
    authType: '',
    username: '',
    password: '',
    token: ''
  },
  scheduleConfig: props.data.scheduleConfig || {
    type: 'interval',
    interval: 5,
    unit: 'minutes',
    cron: '* * * * *',
    time: ''
  }
})

const isExecuting = ref(false)
const hasError = ref(false)

// Methods
const selectTriggerType = (type: string) => {
  nodeData.value.triggerType = type
  handleUpdate()
}

const selectChannel = (channel: string) => {
  nodeData.value.channel = channel
  handleUpdate()
}

const handleUpdate = () => {
  emit('update', {
    ...props.data,
    ...nodeData.value
  })
}

// Convert to Flow State
const toFlowState = () => {
  return {
    name: props.id,
    type: 'trigger',
    properties: {
      triggerType: nodeData.value.triggerType,
      channel: nodeData.value.channel,
      webhookConfig: nodeData.value.webhookConfig,
      scheduleConfig: nodeData.value.scheduleConfig
    },
    transitions: [
      { event: 'success', next: undefined }
    ]
  }
}
</script>