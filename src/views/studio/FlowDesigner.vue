<!-- src/views/FlowDesigner.vue -->
<template>
  <div class="h-screen flex flex-col">
    <!-- Top Bar -->
    <div class="h-14 border-b bg-white flex items-center justify-between px-4">
      <div class="flex items-center space-x-4">
        <router-link to="/studio/flows" class="flex items-center text-gray-600 hover:text-gray-900">
          <svg class="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd" />
          </svg>
          {{ flowName }}
        </router-link>
      </div>

      <div class="flex items-center space-x-3">
        <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm">
          {{ changesCount }} Changes to Flow
        </span>
        <button class="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded" @click="handlePublish">
          Publish
        </button>

        <button class="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50" @click="showTemplateLoader = true">
          Load Template
        </button>
      </div>


      <div class="flex items-center space-x-3">
        <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm">
          {{ changesCount }} Changes to Flow
        </span>
        <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="showTestPanel = !showTestPanel">
          {{ showTestPanel ? 'Hide Test Panel' : 'Show Test Panel' }}
        </button>
        <button class="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded" @click="handlePublish">
          Publish
        </button>
        <button class="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50" @click="showTemplateLoader = true">
          Load Template
        </button>
      </div>

      <div class="flex items-center space-x-3">
        <button 
          class="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50" 
          @click="showVariableManager = true"
        >
          变量管理
        </button>
      </div>

    </div>

    <!-- Main Content -->
    <div class="flex-1 flex">
      <!-- Left Sidebar -->
      <div class="w-64 border-r bg-white flex flex-col">
        <div class="p-4">
          <h1 class="text-lg font-medium">{{ flowName }}</h1>
          <div class="mt-4 space-y-1">
            <div class="flex items-center space-x-2 text-blue-600 font-medium">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16" stroke-width="2" />
              </svg>
              <span>Editor</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-600 pl-6">
              <span>Logs</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-600 pl-6">
              <span>Revision History</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Canvas Area -->
      <div class="flex-1 bg-[#f8fafc] relative overflow-hidden">
        <!-- Floating Toolbar -->
        <FloatingToolbar :show-grid="showGrid" :show-minimap="showMinimap" :can-undo="canUndo" :can-redo="canRedo"
          @zoom-in="onZoomIn" @zoom-out="onZoomOut" @fit-view="onFitView" @toggle-grid="showGrid = !showGrid"
          @toggle-minimap="showMinimap = !showMinimap" @undo="onUndo" @redo="onRedo" />
        <!-- VueFlow Canvas -->
        <VueFlow ref="vueFlowRef" :default-edge-options="defaultEdgeOptions" :connect-on-click="false"
          :default-viewport="{ zoom: 1, x: 0, y: 0 }" :min-zoom="0.2" :max-zoom="4" :snap-to-grid="showGrid"
          :snap-grid="[20, 20]" class="vue-flow-canvas" @connect="handleConnect" @edge-update="handleEdgeUpdate"
          @edge-remove="handleEdgeRemove" @node-drag-start="onNodeDragStart" @node-drag="onNodeDrag"
          @node-drag-stop="onNodeDragStop" @node-click="onNodeClick" @edge-click="onEdgeClick" @pane-click="onPaneClick"
          @edge-mouse-enter="onEdgeMouseEnter" @edge-mouse-leave="onEdgeMouseLeave">
          <!-- SVG 定义箭头标记 -->
          <svg>
            <defs>
              <marker id="edge-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8"
                orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#e75f5f" />
              </marker>
            </defs>
          </svg>

          <!-- Node Templates -->
          <template #node-trigger="props">
            <TriggerNode v-bind="props" :is-selected="selectedNode?.id === props.id"
              @select-trigger="handleTriggerSelect" />
          </template>

          <template #node-send_reply="props">
            <SendAndReplyNode v-bind="props" :is-selected="selectedNode?.id === props.id" />
          </template>

          <template #node-set_variables="props">
            <SetVariablesNode v-bind="props" :is-selected="selectedNode?.id === props.id" />
          </template>

          <template #node-gather_input="props">
            <GatherInputNode v-bind="props" :is-selected="selectedNode?.id === props.id" />
          </template>

          <template #node-connect_call="props">
            <ConnectCallNode v-bind="props" :is-selected="selectedNode?.id === props.id" />
          </template>

          <template #node-make_call="props">
            <OutgoingCallNode v-bind="props" :is-selected="selectedNode?.id === props.id" />
          </template>

          <template #node-split="props">
            <SplitNode v-bind="props" :is-selected="selectedNode?.id === props.id" />
          </template>
 
          <template #node-connect_virtual_agent="props">
            <ConnectVirtualAgentNode v-bind="props" :is-selected="selectedNode?.id === props.id" />
          </template>


          <template #node-say_play="props">
            <SayPlayNode v-bind="props" :is-selected="selectedNode?.id === props.id" />
          </template>

          <template #node-nlp_intent="props">
            <NLPIntentNode v-bind="props" :is-selected="selectedNode?.id === props.id" />
          </template>
          <template #node-split_intent="props">
            <SplitOnIntentNode v-bind="props" :is-selected="selectedNode?.id === props.id" />
          </template>

          <template #node-enqueue_call="props">
            <EnqueueCallNode v-bind="props" :is-selected="selectedNode?.id === props.id" />
          </template>

          <template #node-collect_input="props">
            <CollectInputNode v-bind="props" :is-selected="selectedNode?.id === props.id" />
          </template>

          <template #node-send_wait_reply="props">
            <SendWaitReplyNode v-bind="props" :is-selected="selectedNode?.id === props.id" />
          </template>

          <template #node-wait_for_reply="props">
            <WaitForReplyNode v-bind="props" :is-selected="selectedNode?.id === props.id" />
          </template>

          <!-- 连接线模板 -->
          <template #edge-default="{ id, sourceX, sourceY, targetX, targetY }">
            <BaseEdge :id="id" :path="getSmoothStepPath({
              sourceX,
              sourceY,
              targetX,
              targetY,
              borderRadius: 20
            })" :marker-end="'url(#edge-arrow)'" />
          </template>

          <!-- Minimap -->
          <MiniMap v-if="showMinimap" />
        </VueFlow>
      </div>

      <!-- Template Loader -->
      <TemplateLoader :is-open="showTemplateLoader" @close="showTemplateLoader = false" @load="handleLoadTemplate" />

      <!-- Right Side Panels -->
      <Transition name="slide-right">
        <ConfigPanel v-if="showConfig && !showWidgetLibrary" :title="'FLOW CONFIGURATION'" :show-help="true"
          :show-widget-library="false" :selected-node="selectedNode" @hide="showConfig = false"
          @toggle-widget-library="toggleWidgetLibrary" @update-node="updateSelectedNode" @save="handleSave">
          <template v-if="selectedNode?.type === 'split'">
            <ConditionBuilder 
              :available-variables="flowVariables"
              @update:conditions="updateNodeConditions"
            />
          </template>
          
          <template v-if="showVariableManager">
            <VariableManager
              :initial-variables="flowVariables"
              @update:variables="updateFlowVariables"
            />
          </template>
        </ConfigPanel>
        <WidgetLibrary v-else-if="showWidgetLibrary" @hide="showWidgetLibrary = false" @add-node="addNewNode" />
      </Transition>
    </div>


    <!-- Publish Modal -->
    <TransitionRoot appear :show="isPublishModalOpen" as="template">
      <Dialog as="div" @close="closePublishModal" class="relative z-50">
        <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium text-gray-900">
                  Publish Changes
                </DialogTitle>

                <div class="mt-4">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to publish these changes? This will make your flow live.
                  </p>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    @click="closePublishModal">
                    Cancel
                  </button>
                  <button type="button"
                    class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                    @click="confirmPublish">
                    Publish
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>


    <!-- 添加测试面板 -->
    <Transition name="slide-left">
      <div v-if="showTestPanel" class="fixed right-0 top-0 w-[600px] h-full bg-white shadow-lg z-50">
        <div class="h-full flex flex-col">
          <!-- 测试面板头部 -->
          <div class="flex items-center justify-between p-4 border-b">
            <h2 class="text-lg font-medium">Test Panel</h2>
            <button @click="showTestPanel = false" class="text-gray-500 hover:text-gray-700">
              <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>

          <!-- 测试面板内容 -->
          <div class="flex-1 overflow-y-auto">
            <div class="p-4">
              <!-- 标签切换 -->
              <div class="flex space-x-4 mb-4">
                <button v-for="tab in ['simulator', 'chat']" :key="tab" class="px-4 py-2 rounded-lg" :class="testTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'" @click="testTab = tab">
                  {{ tab === 'simulator' ? 'Flow Simulator' : 'Chat Tester' }}
                </button>
              </div>

 
              <!-- 修改组件属性传递 -->
              <FlowSimulator 
                v-if="testTab === 'simulator'"
                :flow-data="getFlowData()"
                :selected-node="selectedNode"
                @simulation-complete="handleSimulationComplete"
                @node-select="onNodeClick"
              />

              <ChatTester
                v-else-if="testTab === 'chat'"
                :flow-data="getFlowData()"
                :current-node="selectedNode"
                @test-complete="handleTestComplete"
                @update-node="updateSelectedNode"
              />

            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  VueFlow,
  useVueFlow,
  Panel,
  BackgroundVariant,
  FlowEvents,
  EdgeChange,
  NodeChange,
  BaseEdge,
  getSmoothStepPath,
  Edge,
  Connection,
  NodeMouseEvent,
  EdgeMouseEvent,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  Position,
} from '@vue-flow/core'

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

// Vue Flow 核心
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

// Vue Flow 插件组件
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'

import TemplateLoader from '@/components/TemplateLoader.vue'

import FlowSimulator from '@/components/test/FlowSimulator.vue'
import ChatTester from '@/components/test/ChatTester.vue'

import ConditionBuilder from '@/components/builder/ConditionBuilder.vue'
import VariableManager from '@/components/manager/VariableManager.vue'


import { FlowExecutor } from '@/services'
import { generateFlowDefinition } from '@/utils/flowUtils'

import { useFlowStore } from '../../stores/flow'
import { FlowStore } from '../../stores/flow'



// 节点组件导入
import FloatingToolbar from '@/components/FloatingToolbar.vue'
import TriggerNode from '@/components/nodes/TriggerNode.vue'
import SendWaitReplyNode from '@/components/nodes/SendWaitReplyNode.vue'
import GatherInputNode from '@/components/nodes/GatherInputNode.vue'
import ConnectCallNode from '@/components/nodes/ConnectCallNode.vue'
import OutgoingCallNode from '@/components/nodes/OutgoingCallNode.vue'
import SplitNode from '@/components/nodes/SplitNode.vue'
import SayPlayNode from '@/components/nodes/SayPlayNode.vue'
import CallRecordingNode from '@/components/nodes/CallRecordingNode.vue'
import SetVariablesNode from '@/components/nodes/SetVariablesNode.vue'
import HttpRequestNode from '@/components/nodes/HttpRequestNode.vue'
import RunFunctionNode from '@/components/nodes/RunFunctionNode.vue'
import ConnectVirtualAgentNode from '@/components/nodes/ConnectVirtualAgentNode.vue'

import CollectInputNode from '@/components/nodes/CollectInputNode.vue'
import SplitOnIntentNode from '@/components/nodes/SplitOnIntentNode.vue'
import EnqueueCallNode from '@/components/nodes/EnqueueCallNode.vue'
import WaitForReplyNode from '@/components/nodes/WaitForReplyNode.vue'
import NLPIntentNode from '@/components/nodes/NLPIntentNode.vue'

import ConfigPanel from '@/components/panels/ConfigPanel.vue'
import WidgetLibrary from '@/components/panels/WidgetLibrary.vue'

import type { SimulationResults, TestResults } from '@/types/test'



// Stores & Services
const flowStore = new FlowStore()
const flowExecutor = new FlowExecutor(flowStore)
const store = useFlowStore()

// State
const isExecuting = ref(false)
const executionError = ref<Error | null>(null)


const showTestPanel = ref(false)
const testTab = ref<'simulator' | 'chat'>('simulator')


// Flow Management
const saveFlow = async () => {
  const nodes = getNodes()
  const edges = getEdges()
  
  const flowDefinition = generateFlowDefinition(nodes, edges)
  
  try {
    await store.saveFlow({
      id: props.flowId,
      definition: flowDefinition,
      status: 'draft'
    })
    
    changesCount.value = 0
  } catch (error) {
    console.error('Failed to save flow:', error)
    // Show error notification
  }
}

const executeFlow = async () => {
  if (isExecuting.value) return
  
  try {
    isExecuting.value = true
    executionError.value = null
    
    // Save flow first
    await saveFlow()
    
    // Start execution
    const context = await flowExecutor.executeFlow(props.flowId)
    
    // Update nodes with execution results
    updateNodesWithContext(context)
    
  } catch (error) {
    console.error('Flow execution failed:', error)
    executionError.value = error as Error
  } finally {
    isExecuting.value = false
  }
}

const updateNodesWithContext = (context: any) => {
  const nodes = getNodes()
  
  nodes.forEach(node => {
    const stateData = context.stateData[node.id]
    if (stateData) {
      updateNode(node.id, {
        data: {
          ...node.data,
          executionResult: stateData
        }
      })
    }
  })
}

// Router
const router = useRouter()

// Vue Flow Ref
const vueFlowRef = ref(null)

// Flow State
const flowName = ref('My first flow')
const selectedNode = ref(null)
const changesCount = ref(0)
const showConfig = ref(true)
const showWidgetLibrary = ref(false)
const showGrid = ref(true)
const showMinimap = ref(false)
const canUndo = ref(false)
const canRedo = ref(false)
const isPublishModalOpen = ref(false)
const showTemplateLoader = ref(false)

// VueFlow Instance Setup
const {
  getNodes,
  getEdges,
  addNodes,
  addEdges,
  removeNodes,
  removeEdges,
  updateNode,
  updateEdge,
  findNode,
  findEdge,
  zoomIn,
  zoomOut,
  fitView,
  setNodes,
  setEdges,
  onPaneReady,
  getViewport
} = useVueFlow({
  id: 'flow-designer',
  defaultNodes: [{
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: {
      label: 'Trigger',
      trigger: 'Incoming Message'
    }
  }],
  defaultEdges: [],
  defaultViewport: { x: 0, y: 0, zoom: 1 }
})

// 默认连接线配置
const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: {
    stroke: '#e75f5f',
    strokeWidth: 2
  },
  markerEnd: 'url(#edge-arrow)',
  data: {
    selectable: true,
    hoverable: true
  }
}

// 模板加载处理
const handleLoadTemplate = async (template: any) => {
  try {
    if (!vueFlowRef.value) {
      console.error('VueFlow instance not initialized')
      return
    }

    await nextTick() // 等待DOM更新

    // 清除现有节点和边
    setNodes([])
    setEdges([])

    // 添加模板中的节点和边
    if (template.nodes && template.nodes.length > 0) {
      await nextTick()
      setNodes(template.nodes)
    }

    if (template.edges && template.edges.length > 0) {
      await nextTick()
      setEdges(template.edges)
    }

    // 调整视图以显示所有节点
    setTimeout(() => {
      fitView({ padding: 0.2 })
    }, 100)

    // 重置更改计数
    changesCount.value = 0

    // 关闭模板加载器
    showTemplateLoader.value = false

  } catch (error) {
    console.error('Failed to load template:', error)
  }
}

// 连接处理函数
const handleConnect = (connection: Connection) => {
  const sourceNode = findNode(connection.source)
  const targetNode = findNode(connection.target)

  // 创建新的边
  const newEdge: Edge = {
    id: `edge-${connection.source}-${connection.target}`,
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle,
    targetHandle: connection.targetHandle,
    type: 'smoothstep',
    animated: true,
    style: {
      stroke: '#e75f5f',
      strokeWidth: 2
    },
    data: {
      label: `${sourceNode?.data?.label || ''} → ${targetNode?.data?.label || ''}`,
      selectable: true,
      hoverable: true
    }
  }

  addEdges([newEdge])
  changesCount.value++
}

// Edge Event Handlers
const handleEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
  updateEdge(oldEdge, newConnection)
  changesCount.value++
}

const handleEdgeRemove = (edge: Edge) => {
  removeEdges([edge])
  changesCount.value++
}

const onEdgeClick = (event: EdgeMouseEvent, edge: Edge) => {
  edge.selected = !edge.selected
}

// 边的鼠标事件处理
const onEdgeMouseEnter = (event: EdgeMouseEvent, edge: Edge) => {
  if (edge.data?.hoverable) {
    edge.style = {
      ...edge.style,
      strokeWidth: 3,
      stroke: '#ff4444'
    }
  }
}

const onEdgeMouseLeave = (event: EdgeMouseEvent, edge: Edge) => {
  if (edge.data?.hoverable) {
    edge.style = {
      ...edge.style,
      strokeWidth: 2,
      stroke: '#e75f5f'
    }
  }
}

// 节点事件处理
const onNodeDragStart = (event: NodeMouseEvent) => {
  event.node.style = { ...event.node.style, opacity: 0.8 }
}

const onNodeDrag = (event: NodeMouseEvent) => {
  changesCount.value++
}

const onNodeDragStop = (event: NodeMouseEvent) => {
  event.node.style = { ...event.node.style, opacity: 1 }
}

const onNodeClick = (event: NodeMouseEvent) => {
  if (selectedNode.value) {
    selectedNode.value.selected = false
  }
  selectedNode.value = event.node
  showConfig.value = true
  showWidgetLibrary.value = false
  event.node.selected = true
}

const onPaneClick = () => {
  if (selectedNode.value) {
    selectedNode.value.selected = false
  }
  selectedNode.value = null
}

// 更新节点连接
const updateNodesConnections = () => {
  const nodes = getNodes()
  nodes.forEach(node => {
    const incomingEdges = getIncomers(node.id, nodes)
    const outgoingEdges = getOutgoers(node.id, nodes)

    updateNode(node.id, {
      ...node,
      data: {
        ...node.data,
        hasIncoming: incomingEdges.length > 0,
        hasOutgoing: outgoingEdges.length > 0
      }
    })
  })
}

// 面板处理
const toggleWidgetLibrary = () => {
  showWidgetLibrary.value = !showWidgetLibrary.value
  showConfig.value = !showWidgetLibrary.value
}

const updateSelectedNode = (node: any) => {
  if (selectedNode.value) {
    updateNode(selectedNode.value.id, node)
    selectedNode.value = node
    changesCount.value++
  }
}

// 添加新节点
const addNewNode = (nodeType: string) => {
  const viewport = getViewport()
  const position = {
    x: (-viewport.x + window.innerWidth / 2) / viewport.zoom - 150,
    y: (-viewport.y + window.innerHeight / 2) / viewport.zoom - 100
  }

  const nodes = getNodes()
  if (nodes.length > 0) {
    const lastNode = nodes[nodes.length - 1]
    position.y = lastNode.position.y + 200
  }

  const newNode = {
    id: `${nodeType}-${Date.now()}`,
    type: nodeType,
    position,
    data: getDefaultNodeData(nodeType)
  }

  addNodes([newNode])
  changesCount.value++
}

// 获取节点默认数据
const getDefaultNodeData = (type: string) => {
  switch (type) {
    case 'trigger':
      return {
        label: 'Trigger',
        trigger: 'Incoming Message'
      }
    case 'make_call':
      return {
        label: 'Make Outgoing Call',
        address: '{{contact.channel.address}}',
        timeout: 30,
        callerId: ''
      }
    case 'send_reply':
      return {
        label: 'Send & Reply',
        message: '',
        waitTime: 30
      }
    case 'http_request':
      return {
        label: 'Make HTTP Request',
        method: 'GET',
        url: '',
        contentType: 'application/json',
        body: '',
        useAuth: false,
        authType: 'basic',
        username: '',
        password: '',
        token: ''
      }
    case 'run_function':
      return {
        label: 'Run Function',
        service: '',
        environment: 'dev',
        function: '',
        parameters: [],
        url: 'https://[service-name]-[number].[region].twil.io/[function-path]'
      }
    case 'say_play':
      return {
        label: 'Say/Play Message',
        type: 'say',
        message: 'Welcome to our service',
        voice: 'alice',
        language: 'en-US',
        speed: 1
      }
    case 'split':
      return {
        label: 'Split Based On...',
        splitType: 'variable',
        conditions: []
      }
    case 'nlp_intent':
      return {
        label: 'NLP Intent Classification',
        service: 'dialogflow',
        intents: [
          { name: 'greeting', confidence: '0.7' },
          { name: 'help', confidence: '0.7' },
          { name: 'goodbye', confidence: '0.7' }
        ]
      }
    case 'send_message':
      return {
        label: 'Send Message',
        message: '',
        mediaUrl: ''
      }
    case 'wait_for_reply':
      return {
        label: 'Wait for Reply',
        timeout: 300,
        timeoutUnit: 'seconds',
        enableValidation: false
      }
    default:
      return {
        label: type
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }
  }
}

// 画布控制
const onZoomIn = () => {
  zoomIn()
}

const onZoomOut = () => {
  zoomOut()
}

const onFitView = () => {
  fitView()
}

const onUndo = () => {
  if (canUndo.value) {
    // TODO: 实现撤销功能
  }
}

const onRedo = () => {
  if (canRedo.value) {
    // TODO: 实现重做功能
  }
}

// Trigger选择处理
const handleTriggerSelect = (type: string) => {
  if (selectedNode.value && selectedNode.value.type === 'trigger') {
    updateSelectedNode({
      ...selectedNode.value,
      data: { ...selectedNode.value.data, trigger: type }
    })
  }
}

// 保存和发布相关函数
const handleSave = async () => {
  try {
    const flow = {
      name: flowName.value,
      nodes: getNodes(),
      edges: getEdges(),
      viewport: getViewport()
    }
    console.log('Saving flow:', flow)
    changesCount.value = 0
  } catch (error) {
    console.error('Failed to save flow:', error)
  }
}

const handlePublish = () => {
  isPublishModalOpen.value = true
}

const closePublishModal = () => {
  isPublishModalOpen.value = false
}

const confirmPublish = async () => {
  try {
    await handleSave()
    isPublishModalOpen.value = false
    router.push('/studio/flows')
  } catch (error) {
    console.error('Failed to publish flow:', error)
  }
}


// 获取当前流程数据
const getFlowData = () => {
  return {
    nodes: getNodes(),
    edges: getEdges()
  }
}


// 修改测试结果处理方法的类型
const handleSimulationComplete = (results: SimulationResults) => {
  console.log('Simulation complete:', results)
  // TODO: 添加具体的结果处理逻辑
}

const handleTestComplete = (results: TestResults) => {
  console.log('Test complete:', results)
  // TODO: 添加具体的结果处理逻辑
}

// 添加相关样式
const addStyles = () => {
  const styles = `
  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: transform 0.3s ease;
  }

  .slide-left-enter-from,
  .slide-left-leave-to {
    transform: translateX(100%);
  }
  `
  // 将样式添加到文档中
  const styleElement = document.createElement('style')
  styleElement.innerHTML = styles
  document.head.appendChild(styleElement)
}

onMounted(() => {
  addStyles()
})

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + T 打开/关闭测试面板
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
      e.preventDefault()
      showTestPanel.value = !showTestPanel.value
    }
    
    // 测试面板打开时的快捷键
    if (showTestPanel.value) {
      // Ctrl/Cmd + R 运行测试
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault()
        if (testTab.value === 'simulator') {
          handleSimulationComplete(getFlowData())
        } else {
          handleTestComplete(getFlowData())
        }
      }
    }
  })
})




// 生命周期钩子
onMounted(() => {
  onPaneReady(({ fitView }) => {
    fitView()
  })
})

const flowVariables = ref<Array<{
  name: string
  type: string
  description?: string
  defaultValue?: any
}>>([
  {
    name: 'contact.name',
    type: 'string',
    description: '联系人姓名'
  },
  {
    name: 'message.body',
    type: 'string',
    description: '消息内容'
  },
  {
    name: 'flow.status',
    type: 'string',
    description: '当前流程状态'
  }
])

const updateNodeConditions = (conditions: any) => {
  if (selectedNode.value) {
    updateSelectedNode({
      ...selectedNode.value,
      data: {
        ...selectedNode.value.data,
        conditions
      }
    })
  }
}

const updateFlowVariables = (newVariables: any) => {
  flowVariables.value = newVariables
}

// 添加变量管理器控制状态
const showVariableManager = ref(false)

// 注册节点类型
const registerNodes = () => {
  // ... 其他节点注册
  registerNode('trigger', {
    component: TriggerNode,
    label: '触发器',
    category: 'Flow Control',
    ports: {
      output: [
        {
          id: 'next',
          label: '下一步'
        }
      ]
    }
  })
}
</script>


<style>
/* Canvas 基础样式 */
.vue-flow-canvas {
  background-color: #f8fafc;
}

.vue-flow__node {
  cursor: grab;
}

.vue-flow__node.selected {
  box-shadow: 0 0 0 2px #3b82f6;
}

/* 连接线样式 */
.vue-flow__edge {
  pointer-events: all;
}

.vue-flow__edge-path {
  stroke: #e75f5f;
  stroke-width: 2;
  transition: stroke 0.3s, stroke-width 0.3s;
}

.vue-flow__edge.selected .vue-flow__edge-path {
  stroke: #ff4444;
  stroke-width: 3;
}

.vue-flow__edge.animated .vue-flow__edge-path {
  stroke-dasharray: 5;
  animation: dashdraw 1s linear infinite;
}

@keyframes dashdraw {
  from {
    stroke-dashoffset: 10;
  }
}

/* 连接点样式 */
.vue-flow__handle {
  width: 8px;
  height: 8px;
  background: #e75f5f;
  border: none;
  transition: transform 0.2s;
}

.vue-flow__handle:hover {
  transform: scale(1.2);
}

.vue-flow__handle.source {
  bottom: -4px;
}

.vue-flow__handle.target {
  top: -4px;
}

/* 连接预览线 */
.vue-flow__connection-path {
  stroke: #e75f5f;
  stroke-width: 2;
}

/* 箭头样式 */
.vue-flow__edge-path {
  marker-end: url(#edge-arrow);
}

/* 控制按钮样式 */
.vue-flow__controls {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.vue-flow__controls-button {
  background: white;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  padding: 8px;
  height: auto;
}

.vue-flow__controls-button:hover {
  background: #f3f4f6;
}

.vue-flow__controls-button svg {
  width: 16px;
  height: 16px;
  fill: #4b5563;
}

/* 小地图样式 */
.vue-flow__minimap {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

/* 过渡动画 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

/* 网格背景 */
.bg-\[\#f8fafc\] {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* 节点悬停效果 */
.vue-flow__node:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* 面板过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 拖拽时的光标样式 */
.vue-flow__node.dragging {
  cursor: grabbing;
}

/* 连接点激活状态 */
.vue-flow__handle.connectable {
  cursor: crosshair;
}

/* 选中节点的连接点样式 */
.vue-flow__node.selected .vue-flow__handle {
  background: #3b82f6;
}

/* 画布工具栏 */
.floating-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 4;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


.test-panel-enter-active,
.test-panel-leave-active {
  transition: transform 0.3s ease-in-out;
}

.test-panel-enter-from,
.test-panel-leave-to {
  transform: translateX(100%);
}

/* 测试面板内容区域滚动条 */
.test-panel-content {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.test-panel-content::-webkit-scrollbar {
  width: 6px;
}

.test-panel-content::-webkit-scrollbar-track {
  background: transparent;
}

.test-panel-content::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}


</style>../../stores/flow