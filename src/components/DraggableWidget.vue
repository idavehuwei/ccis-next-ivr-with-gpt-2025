<template>
  <div
    class="node-drag px-4 py-2 border rounded cursor-move hover:bg-gray-50"
    draggable="true"
    @dragstart="onDragStart"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: string
}>()

const onDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return
  
  event.dataTransfer.setData('application/nodeType', props.type)
  event.dataTransfer.effectAllowed = 'move'
  
  console.log('Started dragging node type:', props.type)
}
</script>

<style scoped>
.node-drag {
  margin-bottom: 8px;
}
</style>
