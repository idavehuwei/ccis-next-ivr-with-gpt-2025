<template>
  <div class="node-container p-4 bg-white rounded-lg shadow-sm border">
    <div class="node-header mb-3">
      <h3 class="text-lg font-medium">Send Message</h3>
    </div>
    <!-- Basic Information -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Message Template</label>
      <select v-model="selectedTemplate" class="flex-1 rounded-md border-gray-300">
        <option value="">Select a template</option>
        <option v-for="template in templates" :key="template.id" :value="template.id">{{ template.name }}</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
      <textarea v-model="messageContent" rows="3" class="w-full rounded-md border-gray-300" placeholder="Enter message content..."></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useMessageStore } from '@/stores/message'
import type { MessageTemplate } from '@/types/message'

const props = defineProps<{ id: string, data: any }>()
const emit = defineEmits(['update'])

const messageStore = useMessageStore()

const selectedTemplate = ref('')
const messageContent = ref('')
const templates = computed(() => messageStore.templates)

const updateData = () => {
  emit('update', {
    ...props.data,
    content: messageContent.value,
    templateId: selectedTemplate.value
  })
}

watch([messageContent, selectedTemplate], updateData)

onMounted(() => {
  if (props.data) {
    messageContent.value = props.data.content || ''
    selectedTemplate.value = props.data.templateId || ''
  }
})
</script>