// src/components/nodes/PlayMessageNode.vue
<template>
  <BaseNode
    type="play_message"
    :title="nodeData.label"
    :is-selected="isSelected"
    :is-executing="isExecuting"
    :has-error="hasError"
  >
    <template #icon>
      <VolumeIcon class="w-5 h-5 text-blue-500" />
    </template>

    <template #default>
      <div class="p-4 space-y-4">
        <!-- Message Type Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Message Type</label>
          <div class="mt-2 flex space-x-2">
            <button
              v-for="type in messageTypes"
              :key="type.value"
              :class="[
                'px-3 py-1.5 rounded text-sm transition-colors',
                nodeData.messageType === type.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
              @click="selectMessageType(type.value)"
            >
              {{ type.label }}
            </button>
          </div>
        </div>

        <!-- TTS Settings -->
        <template v-if="nodeData.messageType === 'tts'">
          <div class="space-y-4">
            <!-- Text Content -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Text Content</label>
              <textarea
                v-model="nodeData.content"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300"
                placeholder="Enter text to speak..."
                @change="handleUpdate"
              ></textarea>
              <!-- Variable Suggestions -->
              <div class="mt-1 flex flex-wrap gap-2">
                <button
                  v-for="variable in availableVariables"
                  :key="variable.name"
                  class="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                  @click="insertVariable(variable)"
                >
                  {{ variable.name }}
                </button>
              </div>
            </div>

            <!-- Voice Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Voice</label>
              <div class="mt-1 grid grid-cols-2 gap-4">
                <div>
                  <select
                    v-model="nodeData.voice"
                    class="block w-full rounded-md border-gray-300"
                    @change="handleUpdate"
                  >
                    <option value="">Select voice...</option>
                    <optgroup 
                      v-for="group in voiceGroups" 
                      :key="group.language"
                      :label="group.label"
                    >
                      <option
                        v-for="voice in group.voices"
                        :key="voice.id"
                        :value="voice.id"
                      >
                        {{ voice.name }}
                      </option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <select
                    v-model="nodeData.language"
                    class="block w-full rounded-md border-gray-300"
                    @change="handleUpdate"
                  >
                    <option value="">Select language...</option>
                    <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                      {{ lang.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- SSML Options -->
            <div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="nodeData.enableSSML"
                  class="rounded border-gray-300 text-blue-600"
                  @change="handleUpdate"
                />
                <span class="ml-2 text-sm text-gray-700">Enable SSML</span>
              </label>

              <div v-if="nodeData.enableSSML" class="mt-2 space-y-2">
                <div>
                  <label class="block text-sm text-gray-700">Speaking Rate</label>
                  <input
                    type="range"
                    v-model.number="nodeData.ssmlOptions.rate"
                    min="0.5"
                    max="2"
                    step="0.1"
                    class="mt-1 block w-full"
                    @change="handleUpdate"
                  />
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>Slower</span>
                    <span>{{ nodeData.ssmlOptions.rate }}x</span>
                    <span>Faster</span>
                  </div>
                </div>

                <div>
                  <label class="block text-sm text-gray-700">Pitch</label>
                  <input
                    type="range"
                    v-model.number="nodeData.ssmlOptions.pitch"
                    min="-20"
                    max="20"
                    step="1"
                    class="mt-1 block w-full"
                    @change="handleUpdate"
                  />
                  <div class="flex justify-between text-xs text-gray-500">
                    <span>Lower</span>
                    <span>{{ nodeData.ssmlOptions.pitch }}</span>
                    <span>Higher</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Audio File Settings -->
        <template v-if="nodeData.messageType === 'audio'">
          <div class="space-y-4">
            <!-- Audio Source -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Audio Source</label>
              <select
                v-model="nodeData.audioSource"
                class="mt-1 block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              >
                <option value="url">URL</option>
                <option value="upload">Upload</option>
                <option value="library">Audio Library</option>
              </select>
            </div>

            <!-- URL Input -->
            <div v-if="nodeData.audioSource === 'url'">
              <label class="block text-sm font-medium text-gray-700">Audio URL</label>
              <input
                type="url"
                v-model="nodeData.audioUrl"
                class="mt-1 block w-full rounded-md border-gray-300"
                placeholder="https://example.com/audio.mp3"
                @change="handleUpdate"
              />
            </div>

            <!-- Audio Library Selection -->
            <div v-if="nodeData.audioSource === 'library'">
              <label class="block text-sm font-medium text-gray-700">Select Audio</label>
              <select
                v-model="nodeData.audioLibraryId"
                class="mt-1 block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              >
                <option value="">Select audio file...</option>
                <option
                  v-for="audio in audioLibrary"
                  :key="audio.id"
                  :value="audio.id"
                >
                  {{ audio.name }}
                </option>
              </select>
            </div>
          </div>
        </template>

        <!-- Playback Settings -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-900">Playback Settings</h3>

          <!-- Loop Settings -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-700">Loop Count</label>
              <input
                type="number"
                v-model.number="nodeData.loop"
                min="1"
                max="100"
                class="mt-1 block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-700">Inter-loop Delay (ms)</label>
              <input
                type="number"
                v-model.number="nodeData.loopDelay"
                min="0"
                step="100"
                class="mt-1 block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              />
            </div>
          </div>

          <!-- Volume Control -->
          <div>
            <label class="block text-sm text-gray-700">Volume</label>
            <input
              type="range"
              v-model.number="nodeData.volume"
              min="0"
              max="100"
              class="mt-1 block w-full"
              @change="handleUpdate"
            />
            <div class="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>{{ nodeData.volume }}%</span>
              <span>100%</span>
            </div>
          </div>

          <!-- Interrupt Options -->
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="nodeData.interruptible"
                class="rounded border-gray-300 text-blue-600"
                @change="handleUpdate"
              />
              <span class="ml-2 text-sm text-gray-700">Allow Interruption</span>
            </label>

            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="nodeData.bargein"
                class="rounded border-gray-300 text-blue-600"
                @change="handleUpdate"
              />
              <span class="ml-2 text-sm text-gray-700">Enable Barge-in</span>
            </label>
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
        id="interrupted"
        v-if="nodeData.interruptible"
        class="handle-warning"
      >
        <span class="handle-label">Interrupted</span>
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

// 继续 PlayMessageNode.vue 的 script 部分
<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { Volume, Play, Mic } from 'lucide-vue-next'
import BaseNode from './BaseNode.vue'
import { useFlowStore } from '@/stores/flow'

const props = defineProps<{
  id: string
  data: any
  isSelected?: boolean
}>()

const emit = defineEmits(['update'])
const flowStore = useFlowStore()

// 消息类型配置
const messageTypes = [
  { value: 'tts', label: 'Text to Speech' },
  { value: 'audio', label: 'Audio File' }
]

// 语音配置
const voiceGroups = [
  {
    language: 'en',
    label: 'English',
    voices: [
      { id: 'en-US-Neural2-A', name: 'Allison (Neural)' },
      { id: 'en-US-Neural2-B', name: 'Brian (Neural)' },
      { id: 'en-US-Neural2-C', name: 'Caroline (Neural)' }
    ]
  },
  {
    language: 'es',
    label: 'Spanish',
    voices: [
      { id: 'es-ES-Neural2-A', name: 'Ana (Neural)' },
      { id: 'es-ES-Neural2-B', name: 'Bruno (Neural)' }
    ]
  }
]

// 语言配置
const languages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'fr-FR', name: 'French (France)' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' }
]

// 音频库示例数据
const audioLibrary = [
  { id: 'welcome', name: 'Welcome Message' },
  { id: 'hold', name: 'Hold Music' },
  { id: 'goodbye', name: 'Goodbye Message' },
  { id: 'error', name: 'Error Message' }
]

// 节点数据
const nodeData = ref({
  label: props.data.label || 'Play Message',
  messageType: props.data.messageType || 'tts',
  
  // TTS配置
  content: props.data.content || '',
  voice: props.data.voice || '',
  language: props.data.language || 'en-US',
  enableSSML: props.data.enableSSML || false,
  ssmlOptions: props.data.ssmlOptions || {
    rate: 1,
    pitch: 0
  },

  // 音频文件配置
  audioSource: props.data.audioSource || 'url',
  audioUrl: props.data.audioUrl || '',
  audioLibraryId: props.data.audioLibraryId || '',
  
  // 播放配置
  loop: props.data.loop || 1,
  loopDelay: props.data.loopDelay || 0,
  volume: props.data.volume || 100,
  interruptible: props.data.interruptible || false,
  bargein: props.data.bargein || false
})

// 计算属性
const availableVariables = computed(() => flowStore.variables)

const isExecuting = ref(false)
const hasError = ref(false)

// 方法
const selectMessageType = (type: string) => {
  nodeData.value.messageType = type
  handleUpdate()
}

const insertVariable = (variable: any) => {
  const insertion = `{{${variable.name}}}`
  nodeData.value.content += insertion
  handleUpdate()
}

const handleUpdate = () => {
  emit('update', {
    ...props.data,
    ...nodeData.value
  })
}

// SSML 生成
const generateSSML = () => {
  if (!nodeData.value.enableSSML) return nodeData.value.content

  let ssml = `<speak>${nodeData.value.content}`
  
  if (nodeData.value.ssmlOptions.rate !== 1) {
    ssml = `<prosody rate="${nodeData.value.ssmlOptions.rate}">${ssml}</prosody>`
  }
  
  if (nodeData.value.ssmlOptions.pitch !== 0) {
    ssml = `<prosody pitch="${nodeData.value.ssmlOptions.pitch}st">${ssml}</prosody>`
  }
  
  ssml += '</speak>'
  return ssml
}

// 转换为 Flow State
const toFlowState = () => {
  const baseProperties = {
    messageType: nodeData.value.messageType,
    loop: nodeData.value.loop,
    loopDelay: nodeData.value.loopDelay,
    volume: nodeData.value.volume,
    interruptible: nodeData.value.interruptible,
    bargein: nodeData.value.bargein
  }

  let specificProperties = {}
  
  if (nodeData.value.messageType === 'tts') {
    specificProperties = {
      content: nodeData.value.enableSSML ? generateSSML() : nodeData.value.content,
      voice: nodeData.value.voice,
      language: nodeData.value.language,
      enableSSML: nodeData.value.enableSSML,
      ssmlOptions: nodeData.value.ssmlOptions
    }
  } else {
    specificProperties = {
      audioSource: nodeData.value.audioSource,
      audioUrl: nodeData.value.audioUrl,
      audioLibraryId: nodeData.value.audioLibraryId
    }
  }

  return {
    name: props.id,
    type: 'play_message',
    properties: {
      ...baseProperties,
      ...specificProperties
    },
    transitions: [
      { event: 'completed', next: undefined },
      ...(nodeData.value.interruptible ? [{ event: 'interrupted', next: undefined }] : []),
      { event: 'error', next: undefined }
    ]
  }
}

// 导出方法供父组件使用
defineExpose({
  previewMessage: () => {
    if (nodeData.value.messageType === 'tts') {
      return nodeData.value.enableSSML ? generateSSML() : nodeData.value.content
    }
    return nodeData.value.audioSource === 'library' 
      ? audioLibrary.find(a => a.id === nodeData.value.audioLibraryId)?.name
      : nodeData.value.audioUrl
  },
  getPlaybackStatus: () => ({
    isPlaying: isExecuting.value,
    hasError: hasError.value,
    currentLoop: 0 // 实际实现中需要跟踪当前循环次数
  })
})
</script>

<style scoped>
.handle-warning {
  @apply bg-yellow-500;
}

input[type="range"] {
  @apply bg-blue-100;
}

input[type="range"]::-webkit-slider-thumb {
  @apply bg-blue-500;
}
</style>
