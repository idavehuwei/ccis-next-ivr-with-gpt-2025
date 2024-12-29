<!-- src/components/test/ChatTester.vue -->
<template>
  <div class="chat-tester">
    <!-- 测试用例管理 -->
    <div class="mb-4">
      <TestCaseManager
        :test-cases="testCases"
        @select="selectTestCase"
        @create="createTestCase"
        @delete="deleteTestCase"
      />
    </div>

    <!-- 聊天界面 -->
    <div class="border rounded-lg overflow-hidden">
      <!-- 聊天记录 -->
      <div class="h-[400px] overflow-y-auto p-4 bg-gray-50" ref="chatContainer">
        <div
          v-for="(message, index) in chatHistory"
          :key="index"
          class="mb-4"
          :class="message.type === 'user' ? 'text-right' : 'text-left'"
        >
          <div
            class="inline-block max-w-[80%] p-3 rounded-lg"
            :class="message.type === 'user' ? 
              'bg-blue-500 text-white' : 
              'bg-white border'"
          >
            {{ message.content }}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            {{ formatTimestamp(message.timestamp) }}
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="p-4 bg-white border-t">
        <div class="flex space-x-2">
          <input
            v-model="userInput"
            type="text"
            class="flex-1 rounded-md border-gray-300"
            placeholder="Type your message..."
            @keyup.enter="sendMessage"
            :disabled="isProcessing"
          />
          <button
            @click="sendMessage"
            :disabled="isProcessing"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>

    <!-- 测试报告 -->
    <TestReport
      v-if="currentTestCase"
      :test-case="currentTestCase"
      :results="testResults"
      class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import TestCaseManager from './TestCaseManager.vue'
import TestReport from './TestReport.vue'
import type { TestCase, TestResult } from '@/types/test'
import { useMessageStore } from '@/stores/message'

const props = defineProps<{
  flowData: any
  currentNode?: any
}>()

const emit = defineEmits<{
  (e: 'test-complete', results: TestResult): void
  (e: 'update-node', node: any): void
}>()

// 状态
const chatHistory = ref<Array<{
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}>>([])
const userInput = ref('')
const isProcessing = ref(false)
const testCases = ref<TestCase[]>([])
const currentTestCase = ref<TestCase | null>(null)
const testResults = ref<TestResult[]>([])

// Store
const messageStore = useMessageStore()

// 方法
const sendMessage = async () => {
  if (!userInput.value.trim() || isProcessing.value) return

  const message = userInput.value
  userInput.value = ''
  
  // 添加用户消息
  chatHistory.value.push({
    type: 'user',
    content: message,
    timestamp: new Date()
  })

  isProcessing.value = true
  try {
    // 处理消息
    const response = await processMessage(message)
    
    // 添加机器人响应
    chatHistory.value.push({
      type: 'bot',
      content: response,
      timestamp: new Date()
    })

    // 如果在测试用例中，记录结果
    if (currentTestCase.value) {
      recordTestResult(message, response)
    }

  } catch (error) {
    console.error('Error processing message:', error)
    chatHistory.value.push({
      type: 'bot',
      content: 'Sorry, there was an error processing your message.',
      timestamp: new Date()
    })
  } finally {
    isProcessing.value = false
  }

  // 滚动到底部
  await nextTick()
  scrollToBottom()
}

const processMessage = async (message: string) => {
  // 模拟消息处理
  // 这里可以根据实际需求实现更复杂的逻辑
  const nlpNode = props.flowData.nodes.find((n: any) => n.type === 'nlp_intent')
  if (!nlpNode) return 'Sorry, I cannot process your message right now.'

  // 简单的意图匹配
  const intent = matchIntent(message, nlpNode.data.intents)
  const responseNode = findResponseNode(intent?.name || 'fallback')
  
  if (!responseNode) return 'I\'m not sure how to respond to that.'

  // 获取响应内容
  return await getNodeResponse(responseNode)
}

const matchIntent = (message: string, intents: any[]) => {
  // 简单的关键词匹配，实际应用中应该使用NLP服务
  const lowercaseMsg = message.toLowerCase()
  return intents.find(intent => {
    switch (intent.name) {
      case 'greeting':
        return /\b(hi|hello|hey)\b/i.test(lowercaseMsg)
      case 'help':
        return /\b(help|support|assist)\b/i.test(lowercaseMsg)
      case 'goodbye':
        return /\b(bye|goodbye|see you)\b/i.test(lowercaseMsg)
      default:
        return false
    }
  })
}

const findResponseNode = (intentName: string) => {
  const edge = props.flowData.edges.find((e: any) => 
    e.sourceHandle === intentName
  )
  if (!edge) return null
  
  return props.flowData.nodes.find((n: any) => n.id === edge.target)
}

const getNodeResponse = async (node: any) => {
  if (node.data.templateId) {
    const template = messageStore.getTemplateById(node.data.templateId)
    if (template) {
      // 替换变量
      let content = template.content
      template.variables.forEach(varName => {
        content = content.replace(
          new RegExp(`{{${varName}}}`, 'g'),
          `[${varName}]`
        )
      })
      return content
    }
  }
  return node.data.message || 'No response available.'
}

// 测试用例相关方法
const selectTestCase = (testCase: TestCase) => {
  currentTestCase.value = testCase
  chatHistory.value = []
  testResults.value = []
}

const createTestCase = (testCase: TestCase) => {
  testCases.value.push(testCase)
}

const deleteTestCase = (testCaseId: string) => {
  const index = testCases.value.findIndex(tc => tc.id === testCaseId)
  if (index > -1) {
    testCases.value.splice(index, 1)
    if (currentTestCase.value?.id === testCaseId) {
      currentTestCase.value = null
    }
  }
}

const recordTestResult = (input: string, output: string) => {
  if (!currentTestCase.value) return

  const result: TestResult = {
    testCaseId: currentTestCase.value.id,
    success: validateTestCase(output),
    actualOutputs: [{
      type: 'message',
      value: output,
      timestamp: new Date()
    }],
    duration: 0,
    timestamp: new Date()
  }

  testResults.value.push(result)
  emit('test-complete', result)
}

const validateTestCase = (output: string) => {
  if (!currentTestCase.value) return false

  // 简单的输出匹配，可以根据需求扩展
  return currentTestCase.value.expectedOutputs.some(expected =>
    expected.type === 'message' && output.includes(String(expected.value))
  )
}

// 辅助方法
const formatTimestamp = (date: Date) => {
  return date.toLocaleTimeString()
}

const scrollToBottom = () => {
  const container = document.querySelector('.chat-tester .overflow-y-auto')
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

// 监听当前节点变化
watch(() => props.currentNode, (node) => {
  if (node && node.type === 'send_message') {
    // 可以添加一些节点相关的处理逻辑
  }
})
</script>