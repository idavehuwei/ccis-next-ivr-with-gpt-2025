<template>
  <div class="variable-manager p-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium">变量管理器</h3>
      <button @click="showAddVariable = true"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        添加变量
      </button>
    </div>

    <!-- 变量列表 -->
    <div class="space-y-2">
      <div v-for="variable in variables" 
           :key="variable.name"
           class="p-3 border rounded hover:bg-gray-50">
        <div class="flex justify-between items-center">
          <div>
            <span class="font-medium">{{ variable.name }}</span>
            <span class="ml-2 text-sm text-gray-500">({{ variable.type }})</span>
          </div>
          <div class="flex space-x-2">
            <button @click="editVariable(variable)"
                    class="text-blue-500 hover:text-blue-700">
              编辑
            </button>
            <button @click="deleteVariable(variable.name)"
                    class="text-red-500 hover:text-red-700">
              删除
            </button>
          </div>
        </div>
        <p class="text-sm text-gray-600 mt-1">{{ variable.description }}</p>
      </div>
    </div>

    <!-- 添加/编辑变量弹窗 -->
    <Modal v-if="showAddVariable" @close="showAddVariable = false">
      <template #title>
        {{ editingVariable ? '编辑变量' : '添加变量' }}
      </template>
      
      <template #content>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">变量名</label>
            <input v-model="newVariable.name"
                   type="text"
                   class="mt-1 block w-full px-3 py-2 border rounded"
                   :disabled="!!editingVariable"
                   required>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">类型</label>
            <select v-model="newVariable.type"
                    class="mt-1 block w-full px-3 py-2 border rounded">
              <option value="string">文本</option>
              <option value="number">数字</option>
              <option value="boolean">布尔值</option>
              <option value="array">数组</option>
              <option value="object">对象</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">描述</label>
            <textarea v-model="newVariable.description"
                      class="mt-1 block w-full px-3 py-2 border rounded"
                      rows="3">
            </textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">默认值</label>
            <input v-model="newVariable.defaultValue"
                   type="text"
                   class="mt-1 block w-full px-3 py-2 border rounded">
          </div>
        </form>
      </template>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button @click="showAddVariable = false"
                  class="px-4 py-2 border rounded">
            取消
          </button>
          <button @click="handleSubmit"
                  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {{ editingVariable ? '保存' : '添加' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Modal from '../common/Modal.vue'

interface Variable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  description?: string
  defaultValue?: any
}

const props = defineProps<{
  initialVariables?: Variable[]
}>()

const emit = defineEmits(['update:variables'])

const variables = ref<Variable[]>(props.initialVariables || [])
const showAddVariable = ref(false)
const editingVariable = ref<Variable | null>(null)
const newVariable = ref<Variable>({
  name: '',
  type: 'string',
  description: '',
  defaultValue: ''
})

// 编辑变量
const editVariable = (variable: Variable) => {
  editingVariable.value = variable
  newVariable.value = { ...variable }
  showAddVariable.value = true
}

// 删除变量
const deleteVariable = (name: string) => {
  if (confirm('确定要删除这个变量吗？')) {
    variables.value = variables.value.filter(v => v.name !== name)
    emit('update:variables', variables.value)
  }
}

// 添加变量验证方法
const validateVariable = (variable: Variable) => {
  // 验证变量名格式
  if (!/^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(variable.name)) {
    throw new Error('变量名格式不正确')
  }

  // 验证默认值类型
  if (variable.defaultValue !== undefined) {
    switch (variable.type) {
      case 'number':
        if (isNaN(Number(variable.defaultValue))) {
          throw new Error('默认值类型不匹配')
        }
        break
      case 'boolean':
        if (typeof variable.defaultValue !== 'boolean' && 
            !['true', 'false'].includes(String(variable.defaultValue))) {
          throw new Error('默认值类型不匹配')
        }
        break
      // 可以添加其他类型的验证
    }
  }
}

// 提交表单
const handleSubmit = () => {
  try {
    validateVariable(newVariable.value)
    
    if (editingVariable.value) {
      const index = variables.value.findIndex(v => 
        v.name === editingVariable.value?.name
      )
      if (index !== -1) {
        variables.value[index] = { ...newVariable.value }
      }
    } else {
      // 检查变量名是否已存在
      if (variables.value.some(v => v.name === newVariable.value.name)) {
        throw new Error('变量名已存在')
      }
      variables.value.push({ ...newVariable.value })
    }
    
    emit('update:variables', variables.value)
    showAddVariable.value = false
    editingVariable.value = null
    newVariable.value = {
      name: '',
      type: 'string',
      description: '',
      defaultValue: ''
    }
  } catch (error) {
    alert(error.message)
  }
}
</script> 