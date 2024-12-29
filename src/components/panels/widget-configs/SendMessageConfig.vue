<template>
    <div class="config-panel">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Message Template</label>
        <select v-model="selectedTemplate" class="w-full rounded-md border-gray-300">
          <option value="">Select a template</option>
          <option v-for="template in templates" :key="template.id" :value="template.id">{{ template.name }}</option>
        </select>
      </div>
  
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
        <textarea v-model="messageContent" rows="3" class="w-full rounded-md border-gray-300" placeholder="Enter message content..."></textarea>
        <div class="mt-2 flex flex-wrap gap-2">
          <button v-for="variable in availableVariables" :key="variable.name" @click="insertVariable(variable)" class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">{{ variable.name }}</button>
        </div>
      </div>
  
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Media Files</label>
        <div class="space-y-2">
          <div v-for="(url, index) in mediaUrls" :key="index" class="flex items-center space-x-2">
            <input v-model="mediaUrls[index]" type="text" class="flex-1 rounded-md border-gray-300 text-sm" placeholder="Enter media URL" />
            <button @click="removeMedia(index)" class="text-red-500 hover:text-red-700">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button @click="addMedia" class="text-sm text-blue-600 hover:text-blue-700">+ Add Media</button>
        </div>
      </div>
  
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Queue Settings</label>
        <div class="space-y-2">
          <label class="flex items-center">
            <input v-model="useQueue" type="checkbox" class="rounded border-gray-300 text-blue-600" />
            <span class="ml-2 text-sm text-gray-600">Add to message queue</span>
          </label>
          <div v-if="useQueue" class="pl-6">
            <label class="block text-sm text-gray-600 mb-1">Delay (seconds)</label>
            <input v-model.number="queueDelay" type="number" min="0" class="w-24 rounded-md border-gray-300" />
          </div>
        </div>
      </div>
  
      <MessageTemplateEditor v-if="showTemplateEditor" :template="editingTemplate" @save="saveTemplate" @close="showTemplateEditor = false" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import MessageTemplateEditor from '../../nodes/MessageTemplateEditor.vue'
  import { useMessageStore } from '@/stores/message'
  import type { MessageTemplate, MessageVariable } from '@/types/message'
  
  const props = defineProps<{ node: any }>()
  const emit = defineEmits(['update'])
  
  const messageStore = useMessageStore()
  
  const selectedTemplate = ref('')
  const messageContent = ref('')
  const mediaUrls = ref<string[]>([])
  const useQueue = ref(false)
  const queueDelay = ref(0)
  const showTemplateEditor = ref(false)
  const editingTemplate = ref<MessageTemplate | null>(null)
  
  const templates = computed(() => messageStore.templates)
  const availableVariables = computed(() => messageStore.variables)
  
  const insertVariable = (variable: MessageVariable) => {
    const insertion = `{{${variable.name}}}`
    messageContent.value += insertion
  }
  
  const addMedia = () => {
    mediaUrls.value.push('')
  }
  
  const removeMedia = (index: number) => {
    mediaUrls.value.splice(index, 1)
  }
  
  const saveTemplate = (template: MessageTemplate) => {
    messageStore.saveTemplate(template)
    showTemplateEditor.value = false
    selectedTemplate.value = template.id
  }
  
  const updateData = () => {
    emit('update', {
      ...props.node,
      content: messageContent.value,
      mediaUrls: mediaUrls.value.filter(url => url),
      queueSettings: {
        enabled: useQueue.value,
        delay: queueDelay.value
      },
      templateId: selectedTemplate.value
    })
  }
  
  watch([messageContent, mediaUrls, useQueue, queueDelay, selectedTemplate], updateData)
  
  onMounted(() => {
    if (props.node) {
      messageContent.value = props.node.content || ''
      selectedTemplate.value = props.node.templateId || ''
      mediaUrls.value = props.node.mediaUrls || []
      useQueue.value = props.node.queueSettings?.enabled || false
      queueDelay.value = props.node.queueSettings?.delay || 0
    }
  })
  </script>