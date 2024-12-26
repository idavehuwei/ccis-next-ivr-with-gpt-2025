<!-- src/views/FlowEditor.vue -->
<template>
    <div class="h-screen flex flex-col">
      <header class="bg-white shadow z-10">
        <div class="flex justify-between items-center px-4 py-3">
          <h1 class="text-xl font-semibold">IVR Flow Editor</h1>
          <div class="flex gap-4">
            <button
              @click="saveFlow"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              @click="testFlow"
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Test
            </button>
          </div>
        </div>
      </header>
  
      <div class="flex-1 flex">
        <!-- Components panel -->
        <div class="w-64 bg-white border-r shadow-sm overflow-y-auto">
          <div class="p-4">
            <h2 class="text-sm font-medium text-gray-500">Components</h2>
            <div class="mt-4 space-y-2">
              <div
                v-for="node in NODE_TYPES"
                :key="node.type"
                class="p-3 border rounded cursor-move hover:bg-gray-50"
                draggable="true"
                @dragstart="onDragStart($event, node)"
              >
                {{ node.name }}
              </div>
            </div>
          </div>
        </div>
  
        <!-- Canvas -->
        <div
          ref="canvasRef"
          class="flex-1 bg-gray-50 relative overflow-auto"
          @drop="onDrop"
          @dragover.prevent
        >
          <FlowNode
            v-for="node in nodes"
            :key="node.id"
            :node="node"
            @select="selectNode"
          />
        </div>
  
        <!-- Properties panel -->
        <div
          v-if="selectedNode"
          class="w-80 bg-white border-l shadow-sm overflow-y-auto"
        >
          <div class="p-4">
            <h2 class="text-sm font-medium text-gray-500">Properties</h2>
            <NodeProperties
              :node="selectedNode"
              @update="updateNodeProperties"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { NODE_TYPES } from '@/constants/node-types'
  import FlowNode from '@/components/FlowNode.vue'
  import NodeProperties from '@/components/NodeProperties.vue'
  import type { IVRNode } from '@/types'
  import { v4 as uuidv4 } from 'uuid'
  
  const canvasRef = ref<HTMLElement | null>(null)
  const nodes = ref<IVRNode[]>([])
  const selectedNode = ref<IVRNode | null>(null)
  
  const onDragStart = (event: DragEvent, nodeType: any) => {
    event.dataTransfer?.setData('node-type', nodeType.type)
  }
  
  const onDrop = (event: DragEvent) => {
    const nodeType = event.dataTransfer?.getData('node-type')
    if (!nodeType || !canvasRef.value) return
  
    const rect = canvasRef.value.getBoundingClientRect()
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  
    const newNode: IVRNode = {
      id: uuidv4(),
      type: nodeType as any,
      name: NODE_TYPES[nodeType as keyof typeof NODE_TYPES].name,
      position,
      data: {},
    }
  
    nodes.value.push(newNode)
  }
  
  const selectNode = (node: IVRNode) => {
    selectedNode.value = node
  }
  
  const updateNodeProperties = (nodeId: string, properties: any) => {
    const node = nodes.value.find(n => n.id === nodeId)
    if (node) {
      node.data = { ...node.data, ...properties }
    }
  }
  
  const saveFlow = async () => {
    // TODO: Implement save logic
  }
  
  const testFlow = async () => {
    // TODO: Implement test logic
  }
  </script>