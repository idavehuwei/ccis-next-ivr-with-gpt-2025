# components/TriggerNode.vue
<template>
  <div class="trigger-node">
    <div class="trigger-header">
      <span class="trigger-title">Trigger</span>
      <span class="settings-icon">⚙</span>
    </div>
    <div class="trigger-content">
      <div class="trigger-options">
        <div 
          v-for="option in triggerOptions" 
          :key="option"
          class="trigger-option"
          :class="{ 'active': option === data.trigger }"
        >
          <span class="option-dot"></span>
          {{ option }}
          <span class="info-icon">?</span>
        </div>
      </div>
    </div>
    <div class="node-handles">
      <div class="handle-group">
        <Handle 
          v-for="(position, index) in handlePositions"
          :key="index"
          :type="'source'"
          :position="position"
          :style="{ left: `${(index + 1) * 25}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Handle } from '@vue-flow/core';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const triggerOptions = [
  'Incoming Message',
  'Incoming Call',
  'REST API',
  'Subflow'
];

const handlePositions = ['bottom', 'bottom', 'bottom', 'bottom'];
</script>

<style scoped>
.trigger-node {
  background: white;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.trigger-header {
  background: #e74c3c;
  color: white;
  padding: 12px 16px;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trigger-title {
  font-weight: 500;
  font-size: 16px;
}

.settings-icon {
  cursor: pointer;
  font-size: 18px;
}

.trigger-content {
  padding: 16px;
  background: white;
  border-radius: 0 0 8px 8px;
}

.trigger-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.trigger-option {
  background: #fff3f3;
  color: #e74c3c;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.trigger-option:hover {
  background: #ffe5e5;
}

.trigger-option.active {
  background: #e74c3c;
  color: white;
}

.option-dot {
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
}

.info-icon {
  font-size: 12px;
  width: 16px;
  height: 16px;
  border: 1.5px solid currentColor;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-handles {
  position: relative;
  height: 20px;
}

.handle-group {
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: space-around;
}

:deep(.vue-flow__handle) {
  width: 10px;
  height: 10px;
  background: #e74c3c;
  border: 2px solid white;
}
</style>