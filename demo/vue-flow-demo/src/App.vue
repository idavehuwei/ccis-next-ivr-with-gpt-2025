# App.vue
<template>
  <div id="app" class="app-container">
    <div class="vue-flow-wrapper">
      <VueFlow 
        v-model="elements"
        :default-edge-options="{ animated: true }"
        :nodes-draggable="true"
        :nodes-connectable="true"
        @paneClick="onPaneClick"
        @nodeClick="onNodeClick"
      >
        <template #node-reply="nodeProps">
          <CustomNode 
            v-bind="nodeProps"
            @click="onNodeClick" 
          />
        </template>
        <template #node-trigger="nodeProps">
          <TriggerNode 
            v-bind="nodeProps"
            @click="onNodeClick" 
          />
        </template>
      </VueFlow>
    </div>

    <!-- 右侧固定面板 -->
    <div class="right-panel">
      <!-- 组件列表面板 -->
      <div class="panel-section components-list">
        <div class="panel-title">添加组件</div>
        <div 
          class="component-item"
          @click="addNode('trigger', 'Trigger')"
        >
          <div class="component-icon trigger">T</div>
          <div class="component-name">触发器</div>
        </div>
        <div 
          class="component-item"
          @click="addNode('reply', 'Reply')"
        >
          <div class="component-icon reply">R</div>
          <div class="component-name">发送并等待回复</div>
        </div>
      </div>

      <!-- 节点配置面板 -->
      <div class="panel-section node-config">
        <div class="panel-header">
          <div class="panel-title">
            {{ selectedNode ? getNodeTitle(selectedNode.type) : '未选择节点' }}
          </div>
        </div>
        
        <div class="config-content">
          <div v-if="!selectedNode" class="no-selection-hint">
            请选择一个节点进行配置
          </div>
          
          <div v-if="selectedNode && selectedNode.type === 'trigger'" class="config-section">
            <div class="section-title">触发方式</div>
            <div class="radio-group">
              <label v-for="option in triggerOptions" :key="option" class="radio-item">
                <input 
                  type="radio" 
                  name="trigger" 
                  :value="option" 
                  v-model="selectedNode.data.trigger"
                >
                <span>{{ option }}</span>
              </label>
            </div>
          </div>

          <div v-if="selectedNode && selectedNode.type === 'reply'" class="config-section">
            <div class="section-title">回复设置</div>
            <div class="form-group">
              <label>等待时间(秒)</label>
              <input 
                type="number" 
                v-model="selectedNode.data.waitTime" 
                min="0"
              >
            </div>
            <div class="form-group">
              <label>回复内容</label>
              <textarea 
                v-model="selectedNode.data.replyContent" 
                rows="4"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import CustomNode from './components/CustomNode.vue';
import TriggerNode from './components/TriggerNode.vue';
import '@vue-flow/core/dist/style.css';

const elements = ref([]);
const selectedNode = ref(null);
const { project } = useVueFlow();

const triggerOptions = [
  'Incoming Message',
  'Incoming Call',
  'REST API',
  'Subflow'
];

const onNodeClick = (event) => {
  console.log('Node clicked - Raw event:', event);
  
  // 统一处理事件对象的不同结构
  const nodeData = event?.node || event;
  
  if (nodeData) {
    console.log('Setting selectedNode with:', nodeData);
    selectedNode.value = {
      id: nodeData.id,
      type: nodeData.type,
      data: { ...nodeData.data } // 创建数据的深拷贝
    };
    console.log('Updated selectedNode:', selectedNode.value);
  } else {
    console.warn('No valid node data found in event:', event);
  }
};

const onPaneClick = () => {
  console.log('Pane clicked, clearing selection');
  selectedNode.value = null;
};

const getNodeTitle = (type) => {
  console.log('Getting title for node type:', type);
  return type === 'trigger' ? '触发器配置' : '回复节点配置';
};

const addNode = (nodeType, label) => {
  console.log('Adding new node:', { nodeType, label });
  const position = {
    x: window.innerWidth / 2 - 100,
    y: window.innerHeight / 2 - 50
  };
  
  const newNode = {
    id: `${nodeType}-${Date.now()}`,
    type: nodeType,
    position,
    data: { 
      label: nodeType === 'trigger' ? 'Trigger' : 'Reply',
      trigger: 'Incoming Message',
      waitTime: 30,
      replyContent: ''
    },
  };

  console.log('Created new node:', newNode);
  elements.value = [...elements.value, newNode];
  
  // 自动选择新创建的节点
  selectedNode.value = {
    id: newNode.id,
    type: newNode.type,
    data: { ...newNode.data }
  };
};
</script>

<style>
.app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.vue-flow-wrapper {
  flex: 1;
  height: 100%;
  background: #fafafa;
}

.right-panel {
  width: 300px;
  height: 100vh;
  background: white;
  border-left: 1px solid #e0e0e0;
  overflow-y: auto;
}

.panel-section {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.panel-header {
  margin-bottom: 20px;
}

.panel-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.component-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #eee;
  transition: all 0.2s;
}

.component-item:hover {
  background: #f5f5f5;
  transform: translateY(-1px);
}

.component-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-right: 12px;
  color: white;
  font-weight: bold;
}

.component-icon.trigger {
  background: #e74c3c;
}

.component-icon.reply {
  background: #4284f4;
}

.config-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.no-selection-hint {
  color: #999;
  text-align: center;
  padding: 20px;
  font-size: 14px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

:deep(.vue-flow__edge-path) {
  stroke: #4284f4;
  stroke-width: 2;
}

:deep(.vue-flow__edge.animated path) {
  stroke-dasharray: 5;
  animation: dashdraw 0.5s linear infinite;
}

@keyframes dashdraw {
  from {
    stroke-dashoffset: 10;
  }
}
</style>