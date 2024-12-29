<!-- src/components/test/FlowSimulator.vue -->
<template>
  <div class="flow-simulator">
    <!-- 模拟器控制面板 -->
    <div class="mb-4 p-4 bg-gray-50 rounded-lg">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium">Flow Simulator</h3>
        <div class="space-x-2">
          <button
            @click="startSimulation"
            :disabled="isRunning"
            class="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {{ isRunning ? 'Running...' : 'Start' }}
          </button>
          <button
            @click="resetSimulation"
            class="px-3 py-1.5 border rounded hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- 变量编辑器 -->
      <div class="mb-4">
        <h4 class="text-sm font-medium mb-2">Variables</h4>
        <div class="space-y-2">
          <div
            v-for="(value, key) in variables"
            :key="key"
            class="flex items-center space-x-2"
          >
            <span class="text-sm text-gray-600">{{ key }}:</span>
            <input
              v-model="variables[key]"
              type="text"
              class="flex-1 text-sm rounded-md border-gray-300"
              :disabled="isRunning"
            />
          </div>
        </div>
      </div>

      <!-- 模拟速度控制 -->
      <div class="flex items-center space-x-4">
        <label class="text-sm">
          Speed:
          <select v-model="simulationSpeed" class="ml-2 rounded-md border-gray-300">
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="2">2x</option>
            <option value="5">5x</option>
          </select>
        </label>
        <label class="text-sm">
          <input
            v-model="stepByStep"
            type="checkbox"
            class="rounded border-gray-300 text-blue-600"
          />
          Step by step
        </label>
      </div>
    </div>

    <!-- 模拟过程可视化 -->
    <div class="border rounded-lg overflow-hidden">
      <div class="bg-white p-4">
        <h4 class="text-sm font-medium mb-2">Simulation Steps</h4>
        <div class="space-y-2 max-h-[400px] overflow-y-auto">
          <div
            v-for="(step, index) in simulationSteps"
            :key="index"
            class="p-3 rounded-lg"
            :class="getStepClass(step)"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">{{ step.type }}</span>
              <span class="text-xs text-gray-500">
                {{ formatTimestamp(step.timestamp) }}
              </span>
            </div>
            <div class="mt-1 text-sm">
              <div v-if="step.input" class="text-gray-600">
                Input: {{ formatValue(step.input) }}
              </div>
              <div v-if="step.output" class="text-gray-800">
                Output: {{ formatValue(step.output) }}
              </div>
              <div v-if="step.variables" class="text-gray-600 text-xs mt-1">
                Variables: {{ formatVariables(step.variables) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="errors.length > 0" class="mt-4">
      <div
        v-for="(error, index) in errors"
        :key="index"
        class="p-3 bg-red-50 text-red-700 rounded-lg mb-2"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { SimulationStep, SimulationResults } from '@/types/test'
import { useMessageStore } from '@/stores/message'

const props = defineProps<{
  flowData: any
  selectedNode?: any
}>()

const emit = defineEmits<{
  (e: 'simulation-complete', results: SimulationResults): void
  (e: 'node-select', nodeId: string): void
}>()

// 状态
const isRunning = ref(false)
const simulationSpeed = ref('1')
const stepByStep = ref(false)
const variables = ref<Record<string, any>>({})
const simulationSteps = ref<SimulationStep[]>([])
const errors = ref<string[]>([])

// Store
const messageStore = useMessageStore()

// 方法
const startSimulation = async () => {
  isRunning.value = true
  errors.value = []
  simulationSteps.value = []

  try {
    await runSimulation()
    emit('simulation-complete', {
      steps: simulationSteps.value,
      variables: { ...variables.value },
      success: errors.value.length === 0,
      errors: errors.value,
      duration: calculateDuration()
    })
  } catch (error) {
    errors.value.push(error.message)
  } finally {
    isRunning.value = false
  }
}

const resetSimulation = () => {
  simulationSteps.value = []
  errors.value = []
  variables.value = { ...props.flowData.initData?.variables || {} }
}

const runSimulation = async () => {
  const nodes = props.flowData.nodes
  const edges = props.flowData.edges
  
  // 从触发节点开始
  const startNode = nodes.find(n => n.type === 'trigger')
  if (!startNode) {
    throw new Error('No trigger node found')
  }

  await processNode(startNode)
}

const processNode = async (node: any) => {
  // 记录步骤
  const step: SimulationStep = {
    nodeId: node.id,
    type: node.type,
    variables: { ...variables.value },
    timestamp: new Date()
  }

  try {
    // 根据节点类型处理
    switch (node.type) {
      case 'send_message':
        await handleSendMessage(node, step)
        break
      case 'set_variables':
        handleSetVariables(node, step)
        break
      case 'nlp_intent':
        await handleNLPIntent(node, step)
        break
      // 添加其他节点类型的处理...
    }

    simulationSteps.value.push(step)

    // 如果是逐步模式，等待用户确认
    if (stepByStep.value) {
      await waitForUserConfirmation()
    }

    // 处理下一个节点
    const nextNodes = findNextNodes(node)
    for (const nextNode of nextNodes) {
      await processNode(nextNode)
    }

  } catch (error) {
    step.error = error.message
    errors.value.push(`Error in node ${node.id}: ${error.message}`)
    simulationSteps.value.push(step)
  }
}

// 节点处理方法
const handleSendMessage = async (node: any, step: SimulationStep) => {
  const template = node.data.templateId ? 
    messageStore.getTemplateById(node.data.templateId) :
    { content: node.data.message }

  if (!template) {
    throw new Error(`Template not found: ${node.data.templateId}`)
  }

  let content = template.content
  // 替换变量
  if (template.variables) {
    template.variables.forEach(varName => {
      const value = variables.value[varName] || `[${varName}]`
      content = content.replace(new RegExp(`{{${varName}}}`, 'g'), value)
    })
  }

  step.output = content
  
  // 模拟发送延迟
  if (node.data.queueSettings?.enabled) {
    await delay(node.data.queueSettings.delay * 1000 / Number(simulationSpeed.value))
  }
}

const handleSetVariables = (node: any, step: SimulationStep) => {
  node.data.variables.forEach((variable: any) => {
    variables.value[variable.name] = evaluateVariable(variable.value)
  })
  step.output = { ...variables.value }
}

const handleNLPIntent = async (node: any, step: SimulationStep) => {
  // 模拟NLP处理
  const randomIntent = node.data.intents[
    Math.floor(Math.random() * node.data.intents.length)
  ]
  step.output = {
    intent: randomIntent.name,
    confidence: randomIntent.confidence
  }
  await delay(500 / Number(simulationSpeed.value))
}

// 辅助方法
const findNextNodes = (currentNode: any) => {
  const outgoingEdges = props.flowData.edges.filter(
    (e: any) => e.source === currentNode.id
  )
  return outgoingEdges.map((edge: any) =>
    props.flowData.nodes.find((n: any) => n.id === edge.target)
  )
}

const evaluateVariable = (value: string) => {
  // 简单的变量求值，可以根据需要扩展
  if (typeof value !== 'string') return value
  if (value.startsWith('{{') && value.endsWith('}}')) {
    const varName = value.slice(2, -2)
    return variables.value[varName] || `[${varName}]`
  }
  return value
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const waitForUserConfirmation = () => {
  return new Promise(resolve => {
    // 实现用户确认机制，比如通过按钮点击
    // 这里简化为自动延迟
    setTimeout(resolve, 1000)
  })
}

// 格式化方法
const formatTimestamp = (date: Date) => {
  return date.toLocaleTimeString()
}

const formatValue = (value: any) => {
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

const formatVariables = (vars: Record<string, any>) => {
  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${formatValue(value)}`)
    .join(', ')
}

const getStepClass = (step: SimulationStep) => {
  if (step.error) return 'bg-red-50'
  switch (step.type) {
    case 'send_message':
      return 'bg-blue-50'
    case 'set_variables':
      return 'bg-green-50'
    case 'nlp_intent':
      return 'bg-purple-50'
    default:
      return 'bg-gray-50'
  }
}

const calculateDuration = () => {
  if (simulationSteps.value.length < 2) return 0
  const start = simulationSteps.value[0].timestamp
  const end = simulationSteps.value[simulationSteps.value.length - 1].timestamp
  return end.getTime() - start.getTime()
}

// 初始化
watch(() => props.flowData, () => {
  resetSimulation()
}, { immediate: true })
</script>