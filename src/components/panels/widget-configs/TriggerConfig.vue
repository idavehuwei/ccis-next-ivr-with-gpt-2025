<template>
  <div class="trigger-config p-4 space-y-6">
    <!-- 基本信息 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Widget Name</label>
      <input
        v-model="configData.label"
        type="text"
        class="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        @change="updateConfig"
      />
    </div>

    <!-- 触发类型选择 -->
    <div class="space-y-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Trigger Type</label>
      <div class="flex flex-wrap gap-3">
        <button
          v-for="type in triggerTypes"
          :key="type.value"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
            configData.triggerType === type.value 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
          @click="selectTriggerType(type.value)"
        >
          <component 
            :is="type.icon" 
            class="w-5 h-5"
            :class="configData.triggerType === type.value ? 'text-white' : 'text-gray-500'"
          />
          <span>{{ type.label }}</span>
        </button>
      </div>
    </div>

    <!-- 消息触发器配置 -->
    <template v-if="['incoming_message', 'incoming_call'].includes(configData.triggerType)">
      <!-- 渠道配置 -->
      <div class="space-y-3">
        <label class="block text-sm font-medium text-gray-700 mb-2">Channel</label>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="channel in availableChannels"
            :key="channel.value"
            :class="[
              'flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors',
              configData.channel === channel.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:bg-gray-50'
            ]"
            @click="selectChannel(channel.value)"
          >
            <component :is="channel.icon" class="w-5 h-5" />
            <span>{{ channel.label }}</span>
          </button>
        </div>
      </div>

      <!-- 消息条件 -->
      <div class="space-y-3">
        <label class="block text-sm font-medium text-gray-700 mb-2">Message Conditions</label>
        <div class="space-y-3">
          <div v-for="type in messageTypes" :key="type.value" class="flex items-center space-x-2">
            <input
              v-model="configData.messageTypes"
              :value="type.value"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              @change="updateConfig"
            />
            <span>{{ type.label }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Webhook 配置 -->
    <template v-if="configData.triggerType === 'webhook'">
      <div class="rounded-lg border border-gray-200 p-4 space-y-4">
        <WebhookConfig
          v-model="configData.webhookConfig"
          @update="updateConfig"
        />
      </div>
    </template>

    <!-- 定时任务配置 -->
    <template v-if="configData.triggerType === 'schedule'">
      <div class="rounded-lg border border-gray-200 p-4 space-y-4">
        <ScheduleConfig
          v-model="configData.scheduleConfig"
          @update="updateConfig"
        />
      </div>
    </template>

    <!-- 事件处理器 -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <label class="block text-sm font-medium text-gray-700">Event Handlers</label>
        <button
          type="button"
          class="text-sm text-blue-600 hover:text-blue-700"
          @click="addEventHandler"
        >
          Add Handler
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="(handler, index) in configData.events"
          :key="index"
          class="rounded-lg border border-gray-200 p-4"
        >
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-sm font-medium text-gray-900">Handler {{ index + 1 }}</h4>
            <button
              type="button"
              class="text-red-600 hover:text-red-700"
              @click="removeEventHandler(index)"
            >
              Remove
            </button>
          </div>
          <EventHandler
            v-model="configData.events[index]"
            :available-variables="availableVariables"
            @update="updateConfig"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import WebhookConfig from './WebhookConfig.vue'
import ScheduleConfig from './ScheduleConfig.vue'
import EventHandler from './EventHandler.vue'
import { MessageCircle, Phone, Webhook, Clock } from 'lucide-vue-next'

interface TriggerConfigData {
  label: string
  triggerType: string
  channel?: string
  messageTypes?: string[]
  webhookConfig?: {
    url: string
    method: string
    headers: Record<string, string>
    authentication: {
      type: string
      username?: string
      password?: string
      token?: string
    }
  }
  scheduleConfig?: {
    type: 'interval' | 'cron' | 'fixed'
    interval?: number
    intervalUnit?: string
    cronExpression?: string
    fixedTime?: string
    timezone?: string
    repeat?: boolean
  }
  events: Array<{
    type: string
    conditions: Array<{
      field: string
      operator: string
      value: string
    }>
    actions: Array<{
      type: string
      [key: string]: any
    }>
  }>
}

const props = defineProps<{
  nodeId: string
  data: Partial<TriggerConfigData>
}>()

const emit = defineEmits(['update'])

// 触发类型配置
const triggerTypes = [
  { value: 'incoming_message', label: 'Incoming Message', icon: MessageCircle },
  { value: 'incoming_call', label: 'Incoming Call', icon: Phone },
  { value: 'webhook', label: 'Webhook', icon: Webhook },
  { value: 'schedule', label: 'Schedule', icon: Clock }
]

// 可用渠道
const availableChannels = [
  { value: 'sms', label: 'SMS', icon: MessageCircle },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { value: 'voice', label: 'Voice', icon: Phone },
  { value: 'facebook', label: 'Facebook', icon: MessageCircle }
]

// 可用变量
const availableVariables = [
  { name: 'trigger.type', type: 'string' },
  { name: 'message.body', type: 'string' },
  { name: 'message.from', type: 'string' },
  { name: 'webhook.payload', type: 'object' }
]

// 配置数据
const configData = ref<TriggerConfigData>({
  label: '',
  triggerType: 'incoming_message',
  channel: 'sms',
  messageTypes: ['text'],
  webhookConfig: {
    url: '',
    method: 'POST',
    headers: {},
    authentication: {
      type: ''
    }
  },
  scheduleConfig: {
    type: 'interval',
    interval: 60,
    intervalUnit: 'minutes',
    timezone: 'UTC'
  },
  events: []
})

// 监听 props 变化
watch(() => props.data, (newData) => {
  if (newData) {
    configData.value = {
      ...configData.value,
      ...newData
    }
  }
}, { deep: true })

// 触发类型选择
const selectTriggerType = (type: string) => {
  configData.value.triggerType = type
  updateConfig()
}

// 渠道选择
const selectChannel = (channel: string) => {
  configData.value.channel = channel
  updateConfig()
}

// 事件处理器管理
const addEventHandler = () => {
  configData.value.events.push({
    type: 'message',
    conditions: [],
    actions: []
  })
  updateConfig()
}

const removeEventHandler = (index: number) => {
  configData.value.events.splice(index, 1)
  updateConfig()
}

// 更新配置
const updateConfig = () => {
  emit('update', {
    id: props.nodeId,
    data: { ...configData.value }
  })
}
</script>

<style scoped>
.trigger-config button {
  transition: all 0.2s ease-in-out;
}

.trigger-config button:hover {
  transform: translateY(-1px);
}

.trigger-config button:active {
  transform: translateY(0);
}
</style>