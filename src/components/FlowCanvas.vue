<template>
  <div class="h-full w-full">
    <VueFlow 
      v-model="elements" 
      :nodeTypes="nodeTypes"
      class="h-full"
      @drag-over="onDragOver"
      @drop="onDrop"
    >
      <Background />
      <!-- Debug Panel -->
      <Panel position="bottom-left">
        <div class="bg-white p-2 rounded shadow">
          <div>Total Elements: {{ elements.length }}</div>
          <pre>{{ JSON.stringify(elements, null, 2) }}</pre>
        </div>
      </Panel>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VueFlow, Background, Panel, useVueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'

import SendAndReplyNode from './nodes/SendAndReplyNode.vue'

const nodeTypes = {
  sendAndReply: SendAndReplyNode,  
}

const { addNodes } = useVueFlow()

const initialElements = []
const elements = ref(initialElements)

let nodeIdCounter = 1;

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  console.log('Drag over event triggered') // 添加日志
}

const onDrop = (event: DragEvent) => {
  console.log('Drop event triggered') // 添加日志
  const nodeType = event.dataTransfer?.getData('application/nodeType')
  console.log('Dropped node type:', nodeType)

  if (!nodeType) return

  const { left, top } = (event.target as HTMLElement).getBoundingClientRect()
  const position = {
    x: event.clientX - left,
    y: event.clientY - top,
  }

  const newNode = {
    id: `node_${nodeIdCounter++}`, // 生成唯一ID
    type: nodeType,
    position,
    data: { 
      label: 'Send & Wait for Reply',
      message: 'Your message here'
    },
  }

  addNodes([newNode])
  console.log('Added new node:', newNode)
}


onMounted(() => {
  console.log('Flow canvas mounted with node types:', Object.keys(nodeTypes))
})
</script>

<style>
.vue-flow__edge-path {
  stroke: #374151;
  stroke-width: 2;
  cursor: pointer;
}

.vue-flow__edge.selected .vue-flow__edge-path {
  stroke: #3b82f6;
}

.vue-flow__node {
  cursor: grab;
}

.vue-flow__node.selected {
  box-shadow: 0 0 0 2px #3b82f6;
}
</style>
