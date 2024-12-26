<!-- src/App.vue -->
<template>
  <div v-if="isLoginPage">
    <router-view></router-view>
  </div>
  <div v-else class="h-screen flex flex-col">
    <!-- Top Navigation Bar -->
    <TopNav />

    <!-- Sub Navigation -->
    <div class="bg-white border-b h-12 flex items-center px-4">
      <div class="flex space-x-6">
        <button class="text-blue-600 border-b-2 border-blue-600 h-12 px-2">Develop</button>
        <button class="text-gray-600 hover:text-gray-800 h-12 px-2">Monitor</button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex">
      <!-- Left Sidebar -->
      <SideNav />

      <!-- Main Content -->
      <div class="flex-1 overflow-auto">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopNav from '@/components/layout/TopNav.vue'
import SideNav from '@/components/layout/SideNav.vue'

const route = useRoute()
const isLoginPage = computed(() => route.name === 'Login')
</script>

<style>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>