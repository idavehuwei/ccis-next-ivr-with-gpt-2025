<template>
    <div class="p-4 h-screen">
      <h1 class="text-2xl">Monitor Section</h1>
      <div class="vue-flow-container h-full w-full">
        <vue-flow :nodes="nodes" :edges="edges" :node-types="nodeTypes" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, markRaw, shallowRef } from 'vue';
  import { VueFlow } from '@vue-flow/core';
  import TriggerNode from '@/components/nodes/TriggerNode.vue';
  import SetVariablesNode from '@/components/nodes/SetVariablesNode.vue';
  import NLPIntentNode from '@/components/nodes/NLPIntentNode.vue';
 
  // Mark components as raw to avoid reactivity overhead
  const nodeTypes = markRaw({
    trigger: TriggerNode,
    set_variables: SetVariablesNode,
    nlp_intent: NLPIntentNode, 
  });
  
  const nodes = shallowRef([
    {
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 250, y: 50 },
      data: {
        label: 'Message Trigger',
        triggerType: 'incoming_message',
        passes: 0,
        stops: 0,
        exceptions: 0,
      },
    },
    {
      id: 'set-vars',
      type: 'set_variables',
      position: { x: 250, y: 150 },
      data: {
        label: 'Set Initial Variables',
        variables: [
          { name: 'customer_name', value: '{{contact.name}}', type: 'string' },
          { name: 'order_id', value: '{{contact.last_order_id}}', type: 'string' },
        ],
        passes: 0,
        stops: 0,
        exceptions: 0,
      },
    },
    {
      id: 'nlp-1',
      type: 'nlp_intent',
      position: { x: 250, y: 250 },
      data: {
        label: 'Classify Intent',
        service: 'dialogflow',
        intents: [
          { name: 'greeting', confidence: '0.7' },
          { name: 'help', confidence: '0.7' },
          { name: 'goodbye', confidence: '0.7' },
          { name: 'order-status', confidence: '0.7' },
        ],
        passes: 0,
        stops: 0,
        exceptions: 0,
      },
    },
    {
      id: 'msg-greeting',
      type: 'send_message',
      position: { x: 100, y: 400 },
      data: {
        label: 'Send Greeting',
        templateId: 'greeting',
        queueSettings: { enabled: true, delay: 0 },
        passes: 0,
        stops: 0,
        exceptions: 0,
      },
    },
    {
      id: 'msg-help',
      type: 'send_message',
      position: { x: 250, y: 400 },
      data: {
        label: 'Send Help',
        templateId: 'help',
        queueSettings: { enabled: true, delay: 1 },
        passes: 0,
        stops: 0,
        exceptions: 0,
      },
    },
    {
      id: 'msg-order-status',
      type: 'send_message',
      position: { x: 400, y: 400 },
      data: {
        label: 'Send Order Status',
        templateId: 'order-status',
        queueSettings: { enabled: true, delay: 1 },
        passes: 0,
        stops: 0,
        exceptions: 0,
      },
    },
    {
      id: 'msg-goodbye',
      type: 'send_message',
      position: { x: 550, y: 400 },
      data: {
        label: 'Send Goodbye',
        templateId: 'goodbye',
        queueSettings: { enabled: true, delay: 0 },
        passes: 0,
        stops: 0,
        exceptions: 0,
      },
    },
    {
      id: 'msg-fallback',
      type: 'send_message',
      position: { x: 700, y: 400 },
      data: {
        label: 'Send Fallback',
        templateId: 'fallback',
        queueSettings: { enabled: true, delay: 1 },
        passes: 0,
        stops: 0,
        exceptions: 0,
      },
    },
  ]);
  
  const edges = shallowRef([
    { id: 'e1-2', source: 'trigger-1', target: 'set-vars', type: 'smoothstep' },
    { id: 'e2-3', source: 'set-vars', target: 'nlp-1', type: 'smoothstep' },
    { id: 'e3-4', source: 'nlp-1', target: 'msg-greeting', sourceHandle: 'greeting', type: 'smoothstep' },
    { id: 'e3-5', source: 'nlp-1', target: 'msg-help', sourceHandle: 'help', type: 'smoothstep' },
    { id: 'e3-6', source: 'nlp-1', target: 'msg-order-status', sourceHandle: 'order-status', type: 'smoothstep' },
    { id: 'e3-7', source: 'nlp-1', target: 'msg-goodbye', sourceHandle: 'goodbye', type: 'smoothstep' },
    { id: 'e3-8', source: 'nlp-1', target: 'msg-fallback', sourceHandle: 'fallback', type: 'smoothstep' },
  ]);
  
  const getRandomNode = () => {
    return nodes.value[Math.floor(Math.random() * nodes.value.length)];
  };
  
  const mockDataFlow = () => {
    setInterval(() => {
      const randomNode = getRandomNode();
      if (randomNode) {
        randomNode.data.passes += 1;
      }
    }, 5000);
  };
  
  onMounted(() => {
    mockDataFlow();
  });
  </script>
  
  <style scoped>
  .vue-flow-container {
    width: 100%;
    height: 100%;
  }
  </style>