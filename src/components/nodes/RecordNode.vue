// src/components/nodes/RecordNode.vue
<template>
  <BaseNode
    type="record"
    :title="nodeData.label"
    :is-selected="isSelected"
    :is-executing="isExecuting"
    :has-error="hasError"
  >
    <template #icon>
      <MicIcon class="w-5 h-5 text-pink-500" :class="{ 'animate-pulse': isRecording }" />
    </template>

    <template #default>
      <div class="p-4 space-y-4">
        <!-- Record Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Record Type</label>
          <div class="mt-2 flex space-x-2">
            <button
              v-for="type in recordTypes"
              :key="type.value"
              :class="[
                'px-3 py-1.5 rounded text-sm transition-colors',
                nodeData.recordType === type.value
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
              @click="selectRecordType(type.value)"
            >
              {{ type.label }}
            </button>
          </div>
        </div>

        <!-- Start Action -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Start Action</label>
          <select
            v-model="nodeData.startAction"
            class="mt-1 block w-full rounded-md border-gray-300"
            @change="handleUpdate"
          >
            <option value="immediate">Start Immediately</option>
            <option value="beep">Start After Beep</option>
            <option value="message">Start After Message</option>
          </select>

          <div v-if="nodeData.startAction === 'message'" class="mt-2">
            <input
              type="text"
              v-model="nodeData.startMessage"
              class="block w-full rounded-md border-gray-300"
              placeholder="Enter start message..."
              @change="handleUpdate"
            />
          </div>
        </div>

        <!-- Recording Settings -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-900">Recording Settings</h3>

          <!-- Channels -->
          <div>
            <label class="block text-sm text-gray-700">Channels</label>
            <select
              v-model="nodeData.channels"
              class="mt-1 block w-full rounded-md border-gray-300"
              @change="handleUpdate"
            >
              <option value="mono">Mono</option>
              <option value="dual">Dual (Both Legs)</option>
            </select>
          </div>

          <!-- Duration -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-700">Max Duration (seconds)</label>
              <input
                type="number"
                v-model.number="nodeData.maxDuration"
                min="1"
                max="3600"
                class="mt-1 block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-700">Max Silence (seconds)</label>
              <input
                type="number"
                v-model.number="nodeData.maxSilence"
                min="1"
                max="60"
                class="mt-1 block w-full rounded-md border-gray-300"
                @change="handleUpdate"
              />
            </div>
          </div>

          <!-- Options -->
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="nodeData.playBeep"
                class="rounded border-gray-300 text-pink-600"
                @change="handleUpdate"
              />
              <span class="ml-2 text-sm text-gray-700">Play beep before recording</span>
            </label>

            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="nodeData.trimSilence"
                class="rounded border-gray-300 text-pink-600"
                @change="handleUpdate"
              />
              <span class="ml-2 text-sm text-gray-700">Trim silence</span>
            </label>
          </div>
        </div>

        <!-- Transcription Settings -->
        <div v-if="nodeData.recordType === 'transcription'" class="space-y-4">
          <h3 class="text-sm font-medium text-gray-900">Transcription Settings</h3>

          <!-- Language -->
          <div>
            <label class="block text-sm text-gray-700">Language</label>
            <select
              v-model="nodeData.transcriptionLanguage"
              class="mt-1 block w-full rounded-md border-gray-300"
              @change="handleUpdate"
            >
              <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                {{ lang.name }}
              </option>
            </select>
          </div>

          <!-- Model -->
          <div>
            <label class="block text-sm text-gray-700">Model</label>
            <select
              v-model="nodeData.transcriptionModel"
              class="mt-1 block w-full rounded-md border-gray-300"
              @change="handleUpdate"
            >
              <option value="base">Base</option>
              <option value="enhanced">Enhanced</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <!-- Options -->
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="nodeData.transcriptionOptions.enablePunctuation"
                class="rounded border-gray-300 text-pink-600"
                @change="handleUpdate"
              />
              <span class="ml-2 text-sm text-gray-700">Enable punctuation</span>
            </label>

            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="nodeData.transcriptionOptions.enableSpeakerDiarization"
                class="rounded border-gray-300 text-pink-600"
                @change="handleUpdate"
              />
              <span class="ml-2 text-sm text-gray-700">Enable speaker diarization</span>
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
        id="no_input"
        class="handle-warning"
      >
        <span class="handle-label">No Input</span>
      </Handle>
      <Handle
        type="source"
        :position="Position.Right"
        id="max_duration"
        class="handle-warning"
      >
        <span class="handle-label">Max Duration</span>
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

