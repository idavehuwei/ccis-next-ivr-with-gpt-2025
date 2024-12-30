// src/components/nodes/BaseNode.vue
<template>
  <div 
    class="node-base" 
    :class="[
      `node-${type}`,
      { 'is-selected': isSelected },
      { 'is-executing': isExecuting },
      { 'has-error': hasError }
    ]"
  >
    <div class="node-header">
      <slot name="icon"></slot>
      <span class="node-title">{{ title }}</span>
      <div class="node-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    
    <div class="node-content">
      <slot></slot>
    </div>

    <div class="node-footer">
      <slot name="footer"></slot>
    </div>

    <!-- Connection Points -->
    <Handle
      type="target"
      :position="Position.Top"
      :class="handleClass"
    />
    
    <div class="handles-source">
      <slot name="handles"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import type { StateType } from '@/types/flow'

const props = defineProps<{
  type: StateType
  title: string
  isSelected?: boolean
  isExecuting?: boolean
  hasError?: boolean
  executionContext?: any
}>()

const emit = defineEmits<{
  (e: 'execute'): void
  (e: 'update', data: any): void
}>()

const handleClass = computed(() => ({
  'handle-base': true,
  [`handle-${props.type}`]: true
}))
</script>