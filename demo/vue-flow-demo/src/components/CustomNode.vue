# components/CustomNode.vue
<template>
  <div class="reply-node">
    <div class="reply-header">
      <div class="header-icons">
        <span class="message-icon">💬</span>
        <span class="node-name">send_and_reply_1</span>
      </div>
      <div class="header-actions">
        <span class="warning-icon">⚠️</span>
        <span class="close-icon">✕</span>
      </div>
    </div>
    <div class="reply-content">
      <div class="reply-description">
        (Send & Wait For Reply)
      </div>
      <div class="reply-options">
        <div class="option-button">Reply</div>
        <div class="option-button">No Reply</div>
        <div class="option-button">Delivery Fails</div>
      </div>
    </div>
    <div class="node-handles">
      <Handle 
        type="target"
        position="top"
        class="handle handle-top"
      />
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

defineProps({
  data: {
    type: Object,
    required: true
  }
});

const handlePositions = ['bottom', 'bottom', 'bottom'];
</script>

<style scoped>
.reply-node {
  background: white;
  border-radius: 8px;
  min-width: 300px;
  border: 2px solid #4284f4;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.reply-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-icon {
  font-size: 18px;
}

.node-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.warning-icon,
.close-icon {
  cursor: pointer;
  font-size: 14px;
}

.reply-content {
  padding: 16px;
}

.reply-description {
  color: #666;
  font-size: 14px;
  text-align: center;
  margin-bottom: 16px;
}

.reply-options {
  display: flex;
  justify-content: space-around;
  gap: 8px;
}

.option-button {
  background: #f5f5f5;
  color: #333;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-button:hover {
  background: #e0e0e0;
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
  background: #4284f4;
  border: 2px solid white;
}

.handle-top {
  top: -22px !important;
}
</style>