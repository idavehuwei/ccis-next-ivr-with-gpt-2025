<template>
  <div class="bg-white border-l w-80 flex flex-col h-full">
    <!-- Panel Header -->
    <PanelHeader
      :title="getNodeTitle(selectedNode?.type)"
      :show-widget-library="showWidgetLibrary"
      @hide="$emit('hide')"
      @toggle-widget-library="$emit('toggle-widget-library')"
    />

    <!-- Tab Navigation -->
    <TabNav
      v-model="currentTab"
      :tabs="tabs"
    />

    <!-- Panel Content -->
    <div class="flex-1 overflow-y-auto">
      <template v-if="currentTab === 'config' && selectedNode">
        <component
          :is="getConfigComponent(selectedNode.type)"
          :data="selectedNode.data"
          @update="handleNodeUpdate"
        />
      </template>
      <template v-else-if="currentTab === 'transitions'">
        <!-- 转换配置内容 -->
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { IVRNode } from '@/types';
import PanelHeader from './config-panel/PanelHeader.vue';
import TabNav from './config-panel/TabNav.vue';
import SetVariablesConfig from './widget-configs/SetVariablesConfig.vue';
import SayPlayConfig from './widget-configs/SayPlayConfig.vue';
import HttpRequestConfig from './widget-configs/HttpRequestConfig.vue';
import RecordConfig from './widget-configs/RecordConfig.vue';
import EnqueueCallConfig from './widget-configs/EnqueueCallConfig.vue';
import TriggerConfig from './widget-configs/TriggerConfig.vue';
import SplitNodeConfig from './widget-configs/SplitNodeConfig.vue';


const props = defineProps<{
  selectedNode?: IVRNode | null;
  showWidgetLibrary?: boolean;
}>();

const emit = defineEmits<{
  (e: 'hide'): void;
  (e: 'toggle-widget-library'): void;
  (e: 'update-node', node: IVRNode): void;
}>();

const currentTab = ref('config');

const tabs = [
  { label: '配置', value: 'config' },
  { label: '转换', value: 'transitions' }
];

const getConfigComponent = (type?: string) => {
  switch(type) {
    case 'trigger':
      return TriggerConfig;

    case 'set_variables':
      return SetVariablesConfig;
    case 'say_play':
      return SayPlayConfig;
    case 'http_request':
      return HttpRequestConfig;
    case 'call_recording':
      return RecordConfig;
    case 'enqueue_call':
      return EnqueueCallConfig;
    case 'split_node':
      return SplitNodeConfig;
    default:
      return null;
  }
};

const getNodeTitle = (type?: string) => {
  switch(type) {

      case 'send_message':
      return '发送消息'

    case 'set_variables':
      return '设置变量';
    case 'say_play':
      return '语音/播放';
    case 'http_request':
      return 'HTTP请求';
    case 'split_node':
      return 'Split Node';
    default:
      return '节点配置';
  }
};

const handleNodeUpdate = (node: IVRNode) => {
  emit('update-node', node);
};
</script>