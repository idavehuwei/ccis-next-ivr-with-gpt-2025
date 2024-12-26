# src/views/studio/FlowDesigner.vue
<template>
  <div class="h-screen flex flex-col">
    <!-- Top Bar -->
    <div class="h-14 border-b bg-white flex items-center justify-between px-4">
      <div class="flex items-center space-x-4">
        <router-link 
          to="/studio/flows" 
          class="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg class="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          {{ flowName }}
        </router-link>
      </div>

      <div class="flex items-center space-x-3">
        <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm">
          {{ changesCount }} Changes to Flow
        </span>
        <button 
          class="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded"
          @click="handlePublish"
        >
          Publish
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
                <path d="M4 6h16M4 12h16M4 18h16" stroke-width="2"/>
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
        <FloatingToolbar
          :show-grid="showGrid"
          :show-minimap="showMinimap"
          :can-undo="canUndo"
          :can-redo="canRedo"
          @zoom-in="onZoomIn"
          @zoom-out="onZoomOut"
          @fit-view="onFitView"
          @toggle-grid="showGrid = !showGrid"
          @toggle-minimap="showMinimap = !showMinimap"
          @undo="onUndo"
          @redo="onRedo"
        />
        
        <VueFlow 
          v-model="elements"
          :default-edge-options="defaultEdgeOptions"
          :connect-on-click="false"
          :default-viewport="{ zoom: 1, x: 0, y: 0 }"
          :min-zoom="0.2"
          :max-zoom="4"
          :snap-to-grid="showGrid"
          :snap-grid="[20, 20]"
          class="vue-flow-canvas"
          @connect="handleConnect"
          @edge-update="handleEdgeUpdate"
          @edge-remove="handleEdgeRemove"
          @node-drag-start="onNodeDragStart"
          @node-drag="onNodeDrag"
          @node-drag-stop="onNodeDragStop"
          @node-click="onNodeClick"
          @edge-click="onEdgeClick"
          @pane-click="onPaneClick"
          @edge-mouse-enter="onEdgeMouseEnter"
          @edge-mouse-leave="onEdgeMouseLeave"
        >
          <!-- SVG 定义箭头标记 -->
          <svg>
            <defs>
              <marker
                id="edge-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="8"
                markerHeight="8"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#e75f5f" />
              </marker>
            </defs>
          </svg>

          <!-- Node Templates -->
          <template #node-trigger="props">
            <TriggerNode 
              v-bind="props"
              :is-selected="selectedNode?.id === props.id"
              @select-trigger="handleTriggerSelect"
            />
          </template>

          <template #node-send_reply="props">
            <SendAndReplyNode 
              v-bind="props"
              :is-selected="selectedNode?.id === props.id"
            />
          </template>

          <template #node-set_variables="props">
            <SetVariablesNode
              v-bind="props"
              :is-selected="selectedNode?.id === props.id"
            />
          </template>

          <template #node-gather_input="props">
            <GatherInputNode
              v-bind="props"
              :is-selected="selectedNode?.id === props.id"
            />
          </template>

          <template #node-connect_call="props">
            <ConnectCallNode
              v-bind="props"
              :is-selected="selectedNode?.id === props.id"
            />
          </template>

          <template #node-make_call="props">
            <OutgoingCallNode
              v-bind="props"
              :is-selected="selectedNode?.id === props.id"
            />
          </template>

          <template #node-split="props">
            <SplitNode
              v-bind="props"
              :is-selected="selectedNode?.id === props.id"
            />
          </template>

          <template #node-say_play="props">
            <SayPlayNode
              v-bind="props"
              :is-selected="selectedNode?.id === props.id"
            />
          </template>

          <template #node-call_recording="props">
            <CallRecordingNode
              v-bind="props"
              :is-selected="selectedNode?.id === props.id"
            />
          </template>


          <!-- 连接线模板 -->
          <template #edge-default="{ id, sourceX, sourceY, targetX, targetY }">
            <BaseEdge 
              :id="id"
              :path="getSmoothStepPath({
                sourceX,
                sourceY,
                targetX,
                targetY,
                borderRadius: 20
              })"
              :marker-end="'url(#edge-arrow)'"
            />
          </template>


          <!-- Minimap -->
          <MiniMap v-if="showMinimap" />
        </VueFlow>
      </div>

      <!-- Right Side Panels -->
      <Transition name="slide-right">
        <ConfigPanel 
          v-if="showConfig && !showWidgetLibrary"
          :title="'FLOW CONFIGURATION'"
          :show-help="true"
          :show-widget-library="false"
          :selected-node="selectedNode"
          @hide="showConfig = false"
          @toggle-widget-library="toggleWidgetLibrary"
          @update-node="updateSelectedNode"
          @save="handleSave"
        />
        <WidgetLibrary 
          v-else-if="showWidgetLibrary"
          @hide="showWidgetLibrary = false"
          @add-node="addNewNode"
        />
      </Transition>
    </div>

    <!-- Publish Modal -->
    <TransitionRoot appear :show="isPublishModalOpen" as="template">
      <Dialog as="div" @close="closePublishModal" class="relative z-50">
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium text-gray-900">
                  Publish Changes
                </DialogTitle>

                <div class="mt-4">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to publish these changes? This will make your flow live.
                  </p>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    @click="closePublishModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                    @click="confirmPublish"
                  >
                    Publish
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

// Vue Flow 核心
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { 
  VueFlow, 
  useVueFlow, 
  BaseEdge, 
  getSmoothStepPath,
  Edge,
  Connection,
  NodeMouseEvent,
  EdgeMouseEvent,
  getIncomers,
  getOutgoers,
  getConnectedEdges
} from '@vue-flow/core'

// Vue Flow 插件组件
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'

// Components
import FloatingToolbar from '@/components/FloatingToolbar.vue'
import TriggerNode from '@/components/nodes/TriggerNode.vue'
import SendAndReplyNode from '@/components/nodes/SendAndReplyNode.vue'
import GatherInputNode from '@/components/nodes/GatherInputNode.vue'
import ConnectCallNode from '@/components/nodes/ConnectCallNode.vue'
import OutgoingCallNode from '@/components/nodes/OutgoingCallNode.vue'
import SplitNode from '@/components/nodes/SplitNode.vue'

import SayPlayNode from '@/components/nodes/SayPlayNode.vue'
import CallRecordingNode from '@/components/nodes/CallRecordingNode.vue'

import SetVariablesNode from '@/components/nodes/SetVariablesNode.vue'


import ConfigPanel from '@/components/panels/ConfigPanel.vue'
import WidgetLibrary from '@/components/panels/WidgetLibrary.vue'

const router = useRouter()

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

// Get Vue Flow Instance
const {
  addNodes,
  addEdges,
  updateNode,
  updateEdge,
  removeNodes,
  removeEdges,
  getNodes,
  findNode,
  findEdge,
  zoomIn,
  zoomOut,
  fitView,
  onPaneReady
} = useVueFlow()

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

// 初始节点
const elements = ref([
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { label: 'Trigger' }
  }
])

// 连接处理函数
const handleConnect = (connection: Connection) => {
  // 验证连接
  // if (!isValidConnection(connection)) {
  //   return false
  // }

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
// if (!isValidConnection(newConnection)) {
//   return
// }
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

// Node Event Handlers
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

// Update Node Connections
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

// Panel Handlers
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
  default:
    return {
      label: type
    }
}
}

// Canvas Controls
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

// Handle trigger selection
const handleTriggerSelect = (type: string) => {
if (selectedNode.value && selectedNode.value.type === 'trigger') {
  updateSelectedNode({
    ...selectedNode.value,
    data: { ...selectedNode.value.data, trigger: type }
  })
}
}

// Save & Publish
const handleSave = async () => {
try {
  // TODO: 实现保存逻辑
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
  // TODO: 实现发布逻辑
  isPublishModalOpen.value = false
  router.push('/studio/flows')
} catch (error) {
  console.error('Failed to publish flow:', error)
}
}

// Init
onMounted(() => {
onPaneReady(({ fitView }) => {
  fitView()
})
})
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
</style>

