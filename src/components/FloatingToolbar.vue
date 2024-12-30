<!-- src/components/FloatingToolbar.vue -->
<template>
  <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
    <div class="bg-white rounded-lg shadow-md border border-gray-200 flex divide-x">
      <!-- Zoom Controls -->
      <div class="p-1 flex items-center space-x-1">
        <button 
          class="p-1.5 hover:bg-gray-100 rounded text-gray-600" 
          @click="$emit('zoom-in')"
          title="Zoom In"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </button>
        <button 
          class="p-1.5 hover:bg-gray-100 rounded text-gray-600" 
          @click="$emit('zoom-out')"
          title="Zoom Out"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
        <button 
          class="p-1.5 hover:bg-gray-100 rounded text-gray-600" 
          @click="$emit('fit-view')"
          title="Fit to View"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4z" />
            <path d="M17 16a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 112 0v4z" />
          </svg>
        </button>
      </div>

      <!-- Grid & Layout Controls -->
      <div class="p-1 flex items-center space-x-1">
        <button 
          class="p-1.5 hover:bg-gray-100 rounded text-gray-600"
          :class="{ 'bg-gray-100': showGrid }"
          @click="$emit('toggle-grid')"
          title="Toggle Grid"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button 
          class="p-1.5 hover:bg-gray-100 rounded text-gray-600"
          :class="{ 'bg-gray-100': showMinimap }"
          @click="$emit('toggle-minimap')"
          title="Toggle Minimap"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 4a2 2 0 012-2h10a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V4zm0 7a2 2 0 012-2h10a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Edit Controls -->
      <div class="p-1 flex items-center space-x-1">
        <button 
          class="p-1.5 hover:bg-gray-100 rounded text-gray-600"
          @click="$emit('undo')"
          :disabled="!canUndo"
          title="Undo"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <button 
          class="p-1.5 hover:bg-gray-100 rounded text-gray-600"
          @click="$emit('redo')"
          :disabled="!canRedo"
          title="Redo"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.293 3.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 7H9a5 5 0 00-5 5v2a1 1 0 11-2 0v-2a7 7 0 017-7h5.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        <!-- New Arrange Button -->
        <button 
          class="p-1.5 hover:bg-gray-100 rounded text-gray-600"
          @click="$emit('arrange-components')"
          title="Arrange Components"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 3h4v4H3V3zm0 8h4v4H3v-4zm8-8h4v4h-4V3zm0 8h4v4h-4v-4z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
showGrid?: boolean
showMinimap?: boolean
canUndo?: boolean
canRedo?: boolean
}>()

defineEmits<{
(e: 'zoom-in'): void
(e: 'zoom-out'): void
(e: 'fit-view'): void
(e: 'toggle-grid'): void
(e: 'toggle-minimap'): void
(e: 'undo'): void
(e: 'redo'): void
(e: 'arrange-components'): void // 新增的事件
}>()
</script>