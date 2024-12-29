<template>
  <div class="node-container p-4 bg-white rounded-lg shadow-sm border">
    <div class="node-header mb-3">
      <h3 class="text-lg font-medium">Send Message</h3>
    </div>

    <!-- 消息模板选择 -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Message Template
      </label>
      <div class="flex space-x-2">
        <select 
          v-model="selectedTemplate"
          class="flex-1 rounded-md border-gray-300"
        >
          <option value="">Select a template</option>
          <option 
            v-for="template in templates" 
            :key="template.id"
            :value="template.id"
          >
            {{ template.name }}
          </option>
        </select>
        <button 
          @click="showTemplateEditor = true"
          class="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          New
        </button>
      </div>
    </div>

    <!-- 消息内容编辑 -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Message Content
      </label>
      <textarea
        v-model="messageContent"
        rows="3"
        class="w-full rounded-md border-gray-300"
        placeholder="Enter message content..."
      ></textarea>
      
      <!-- 变量插入按钮 -->
      <div class="mt-2 flex flex-wrap gap-2">
        <button
          v-for="variable in availableVariables"
          :key="variable.name"
          @click="insertVariable(variable)"
          class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          {{ variable.name }}
        </button>
      </div>
    </div>

    <!-- 媒体文件上传 -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Media Files
      </label>
      <div class="space-y-2">
        <div 
          v-for="(url, index) in mediaUrls" 
          :key="index"
          class="flex items-center space-x-2"
        >
          <input 
            v-model="mediaUrls[index]"
            type="text"
            class="flex-1 rounded-md border-gray-300 text-sm"
            placeholder="Enter media URL"
          />
          <button 
            @click="removeMedia(index)"
            class="text-red-500 hover:text-red-700"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button
          @click="addMedia"
          class="text-sm text-blue-600 hover:text-blue-700"
        >
          + Add Media
        </button>
      </div>
    </div>

    <!-- 消息队列设置 -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Queue Settings
      </label>
      <div class="space-y-2">
        <label class="flex items-center">
          <input
            v-model="useQueue"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600"
          />
          <span class="ml-2 text-sm text-gray-600">Add to message queue</span>
        </label>
        
        <div v-if="useQueue" class="pl-6">
          <label class="block text-sm text-gray-600 mb-1">
            Delay (seconds)
          </label>
          <input
            v-model.number="queueDelay"
            type="number"
            min="0"
            class="w-24 rounded-md border-gray-300"
          />
        </div>
      </div>
    </div>

    <!-- 模板编辑器弹窗 -->
    <MessageTemplateEditor
      v-if="showTemplateEditor"
      :template="editingTemplate"
      @save="saveTemplate"
      @close="showTemplateEditor = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import MessageTemplateEditor from './MessageTemplateEditor.vue'
import { useMessageStore } from '@/stores/message'
import type { MessageTemplate, MessageVariable } from '@/types/message'

const props = defineProps<{
  id: string
  data: any
}>()

const emit = defineEmits(['update'])

const messageStore = useMessageStore()

// 状态
const selectedTemplate = ref('')
const messageContent = ref('')
const mediaUrls = ref<string[]>([])
const useQueue = ref(false)
const queueDelay = ref(0)
const showTemplateEditor = ref(false)
const editingTemplate = ref<MessageTemplate | null>(null)

// 计算属性
const templates = computed(() => messageStore.templates)
const availableVariables = computed(() => messageStore.variables)

// 方法
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

// 监听变化并更新节点数据
watch([messageContent, mediaUrls, useQueue, queueDelay, selectedTemplate], () => {
  emit('update', {
    ...props.data,
    content: messageContent.value,
    mediaUrls: mediaUrls.value.filter(url => url),
    queueSettings: {
      enabled: useQueue.value,
      delay: queueDelay.value
    },
    templateId: selectedTemplate.value
  })
})

// 1. 添加初始化数据加载
onMounted(() => {
  if (props.data) {
    messageContent.value = props.data.content || ''
    selectedTemplate.value = props.data.templateId || ''
    mediaUrls.value = props.data.mediaUrls || []
    useQueue.value = props.data.queueSettings?.enabled || false
    queueDelay.value = props.data.queueSettings?.delay || 0
  }
})

// 2. 添加模板选择处理
const handleTemplateSelect = (templateId: string) => {
  const template = templates.value.find(t => t.id === templateId)
  if (template) {
    messageContent.value = template.content
    // 自动加载模板变量
    template.variables.forEach(varName => {
      if (!availableVariables.value.find(v => v.name === varName)) {
        messageStore.addVariable({
          name: varName,
          value: '',
          type: 'string'
        })
      }
    })
  }
}

// 3. 添加预览功能
const previewMessage = computed(() => {
  let content = messageContent.value
  availableVariables.value.forEach(variable => {
    const regex = new RegExp(`{{${variable.name}}}`, 'g')
    content = content.replace(regex, variable.value || `[${variable.name}]`)
  })
  return content
})
</script>