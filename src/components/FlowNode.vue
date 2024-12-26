<!-- src/components/FlowNode.vue -->
<template>
    <div
      class="flow-node absolute"
      :class="[`node-${node.type}`, { 'is-selected': isSelected }]"
      :style="{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`
      }"
      @click="$emit('select', node)"
    >
      <!-- 节点头部 -->
      <div class="node-header">
        <span>{{ node.name }}</span>
      </div>
  
      <!-- 节点内容 -->
      <div class="node-content">
        <!-- 根据节点类型显示不同的内容 -->
        <div v-if="node.type === 'gather_input'">
          <div class="text-sm text-gray-500">
            {{ node.data.promptMessage || 'No prompt message set' }}
          </div>
        </div>
  
        <div v-if="node.type === 'connect_call'">
          <div class="text-sm text-gray-500">
            {{ node.data.phoneNumber || 'No phone number set' }}
          </div>
        </div>
  
        <div v-if="node.type === 'split'">
          <div class="text-sm text-gray-500">
            Split by: {{ node.data.splitType || 'Not configured' }}
          </div>
        </div>
      </div>
  
      <!-- 连接点 -->
      <div class="connection-points">
        <div class="point point-in" />
        <div class="point point-out" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import type { IVRNode } from '@/types'
  
  const props = defineProps<{
    node: IVRNode
    selectedId?: string
  }>()
  
  const isSelected = computed(() => props.selectedId === props.node.id)
  </script>
  
  <style scoped>
  .flow-node {
    width: 200px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  }
  
  .node-header {
    padding: 0.5rem;
    background: #f3f4f6;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 0.375rem 0.375rem 0 0;
    font-weight: 500;
  }
  
  .node-content {
    padding: 0.5rem;
  }
  
  .is-selected {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
  
  .connection-points {
    position: relative;
  }
  
  .point {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #6b7280;
    border-radius: 50%;
  }
  
  .point-in {
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .point-out {
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
  }
  </style>