<template>
    <div class="schedule-config space-y-4">
      <!-- 调度类型选择 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Schedule Type</label>
        <select
          v-model="localValue.type"
          class="w-full px-3 py-2 border rounded-md"
          @change="updateValue"
        >
          <option value="interval">Interval</option>
          <option value="cron">Cron Expression</option>
          <option value="fixed">Fixed Time</option>
        </select>
      </div>
  
      <!-- 间隔配置 -->
      <template v-if="localValue.type === 'interval'">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Interval</label>
            <input
              v-model.number="localValue.interval"
              type="number"
              min="1"
              class="w-full px-3 py-2 border rounded-md"
              @change="updateValue"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Unit</label>
            <select
              v-model="localValue.intervalUnit"
              class="w-full px-3 py-2 border rounded-md"
              @change="updateValue"
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>
        </div>
      </template>
  
      <!-- Cron 表达式配置 -->
      <template v-if="localValue.type === 'cron'">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Cron Expression
            <span class="text-xs text-gray-500 ml-1">
              (e.g., "0 */15 * * * *" for every 15 minutes)
            </span>
          </label>
          <input
            v-model="localValue.cronExpression"
            type="text"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="* * * * *"
            @change="updateValue"
          />
          <!-- Cron 表达式预览 -->
          <div v-if="localValue.cronExpression" class="mt-2 text-sm text-gray-500">
            Next run time: {{ getNextRunTime() }}
          </div>
        </div>
  
        <!-- Cron 表达式生成器 -->
        <div class="mt-4">
          <button
            type="button"
            @click="showCronBuilder = !showCronBuilder"
            class="text-sm text-blue-600 hover:text-blue-700"
          >
            {{ showCronBuilder ? 'Hide' : 'Show' }} Cron Builder
          </button>
          <div v-if="showCronBuilder" class="mt-2 border rounded-lg p-4">
            <!-- 可以添加更多用户友好的 cron 配置选项 -->
            <div class="space-y-2">
              <div v-for="(field, index) in cronFields" :key="index">
                <label class="block text-sm text-gray-700">{{ field.label }}</label>
                <select
                  v-model="field.value"
                  class="mt-1 w-full px-2 py-1 border rounded"
                  @change="buildCronExpression"
                >
                  <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </template>
  
      <!-- 固定时间配置 -->
      <template v-if="localValue.type === 'fixed'">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
            <input
              v-model="localValue.fixedTime"
              type="datetime-local"
              class="w-full px-3 py-2 border rounded-md"
              @change="updateValue"
            />
          </div>
          <div>
            <label class="flex items-center">
              <input
                v-model="localValue.repeat"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600"
                @change="updateValue"
              />
              <span class="ml-2 text-sm text-gray-700">Repeat Daily</span>
            </label>
          </div>
        </div>
      </template>
  
      <!-- 时区配置 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
        <select
          v-model="localValue.timezone"
          class="w-full px-3 py-2 border rounded-md"
          @change="updateValue"
        >
          <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
            {{ tz.label }}
          </option>
        </select>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import dayjs from 'dayjs'
  import utc from 'dayjs/plugin/utc'
  import timezone from 'dayjs/plugin/timezone'
  import cronParser from 'cron-parser'
  
  dayjs.extend(utc)
  dayjs.extend(timezone)
  
  const props = defineProps<{
    modelValue: {
      type: 'interval' | 'cron' | 'fixed'
      interval?: number
      intervalUnit?: string
      cronExpression?: string
      fixedTime?: string
      timezone?: string
      repeat?: boolean
    }
  }>()
  
  const emit = defineEmits(['update:modelValue'])
  
  // 本地数据
  const localValue = ref({ ...props.modelValue })
  const showCronBuilder = ref(false)
  
  // 时区列表
  const timezones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' }
  ]
  
  // Cron 表达式构建器字段
  const cronFields = ref([
    {
      label: 'Minutes',
      value: '*',
      options: [
        { value: '*', label: 'Every minute' },
        { value: '*/5', label: 'Every 5 minutes' },
        { value: '*/15', label: 'Every 15 minutes' },
        { value: '*/30', label: 'Every 30 minutes' }
      ]
    },
    {
      label: 'Hours',
      value: '*',
      options: [
        { value: '*', label: 'Every hour' },
        { value: '*/2', label: 'Every 2 hours' },
        { value: '*/4', label: 'Every 4 hours' },
        { value: '*/6', label: 'Every 6 hours' }
      ]
    },
    // 可以添加更多字段...
  ])
  
  // 获取下次运行时间
  const getNextRunTime = () => {
    try {
      const interval = cronParser.parseExpression(localValue.value.cronExpression || '* * * * *', {
        tz: localValue.value.timezone
      })
      return interval.next().toString()
    } catch (err) {
      return 'Invalid cron expression'
    }
  }
  
  // 构建 Cron 表达式
  const buildCronExpression = () => {
    const expression = cronFields.value.map(field => field.value).join(' ')
    localValue.value.cronExpression = expression
    updateValue()
  }
  
  // 更新值
  const updateValue = () => {
    emit('update:modelValue', { ...localValue.value })
  }
  </script>