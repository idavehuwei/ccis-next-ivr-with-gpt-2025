<template>
  <div class="ivr-flow">
    <vue-flow v-if="nodes.length" :nodes="nodes" :edges="edges" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/ivr'

const nodes = ref([])
const edges = ref([])

const initFlowData = async () => {
  try {
    const { data } = await api.getFlowData()
    if (data.code === 200) {
      nodes.value = data.data.nodes
      edges.value = data.data.edges
    }
  } catch (error) {
    console.error('获取流程数据失败:', error)
  }
}

onMounted(() => {
  initFlowData()
})
</script> 