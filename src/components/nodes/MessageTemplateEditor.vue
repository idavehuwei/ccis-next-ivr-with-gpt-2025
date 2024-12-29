<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg w-[600px] p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">
          {{ template ? 'Edit Template' : 'New Template' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="saveTemplate">
        <div class="space-y-4">
          <!-- 模板名称 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Template Name
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full rounded-md border-gray-300"
            />
          </div>

          <!-- 模板内容 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              v-model="form.content"
              rows="4"
              required
              class="w-full rounded-md border-gray-300"
            ></textarea>
          </div>

          <!-- 变量定义 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Variables
            </label>
            <div class="space-y-2">
              <div 
                v-for="(variable, index) in form.variables"
                :key="index"
                class="flex items-center space-x-2"
              >
                <input
                  v-model="variable.name"
                  type="text"
                  class="flex-1 rounded-md border-gray-300"
                  placeholder="Variable name"
                />
                <select
                  v-model="variable.type"
                  class="rounded-md border-gray-300"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                </select>
                <button 
                  type="button"
                  @click="removeVariable(index)"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button
                type="button"
                @click="addVariable"
                class="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Variable
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm text-gray-700 bg-white border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Template
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MessageTemplate, MessageVariable } from '@/types/message'

const props = defineProps<{
  template?: MessageTemplate
}>()

const emit = defineEmits<{
  (e: 'save', template: MessageTemplate): void
  (e: 'close'): void
}>()

const form = ref({
  name: props.template?.name || '',
  content: props.template?.content || '',
  variables: props.template?.variables.map(name => ({
    name,
    type: 'string'
  })) || [] as MessageVariable[]
})

const addVariable = () => {
  form.value.variables.push({
    name: '',
    type: 'string'
  })
}

const removeVariable = (index: number) => {
  form.value.variables.splice(index, 1)
}

const saveTemplate = () => {
  emit('save', {
    id: props.template?.id || Date.now().toString(),
    name: form.value.name,
    content: form.value.content,
    variables: form.value.variables.map(v => v.name),
    type: 'text'
  })
}

const validateVariable = (variable: MessageVariable) => {
  return {
    isValid: variable.name.trim() !== '' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(variable.name),
    message: variable.name.trim() === '' ? 
      '变量名不能为空' : 
      '变量名必须以字母开头，只能包含字母、数字和下划线'
  }
}

const previewTemplate = computed(() => {
  let content = form.value.content
  form.value.variables.forEach(variable => {
    const regex = new RegExp(`{{${variable.name}}}`, 'g')
    content = content.replace(regex, `[${variable.name}]`)
  })
  return content
})

const exportTemplate = () => {
  const template = {
    name: form.value.name,
    content: form.value.content,
    variables: form.value.variables
  }
  const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${template.name}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script> 