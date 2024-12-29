<!-- src/components/layout/SideNav.vue -->
<template>
  <div class="w-64 bg-white border-r flex flex-col min-h-screen">
    <!-- Main Navigation -->
    <nav class="flex-1 py-2">
      <!-- Studio -->
      <router-link 
        to="/studio" 
        class="px-4 py-2 flex items-center space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        :class="{ 'bg-gray-50': isRouteActive('/studio') }"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M4 6h16M4 12h16M4 18h16" stroke-width="2"/>
        </svg>
        <span>Studio</span>
      </router-link>

     


      <!-- Phone Numbers Section -->
      <div class="relative">
        <router-link 
          to="/phone-numbers"
          class="px-4 py-2 flex items-center justify-between text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          :class="{ 'bg-gray-50': isRouteActive('/phone-numbers') }"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-width="2"/>
            </svg>
            <span>Phone Numbers</span>
          </div>
          <svg 
            class="w-4 h-4 transform transition-transform duration-200"
            :class="{ 'rotate-90': isPhoneNumbersOpen }"
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M7.293 4.293a1 1 0 011.414 0L14.414 10l-5.707 5.707a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </router-link>

        <!-- Phone Numbers Submenu -->
        <template v-if="isPhoneNumbersOpen">
          <!-- Manage Section -->
          <div class="pl-8">
            <div 
              class="flex items-center py-2 px-4 text-gray-600 cursor-pointer justify-between"
              @click="toggleManageSection"
            >
              <span class="text-sm font-medium">MANAGE</span>
              <svg 
                class="w-4 h-4 transform transition-transform duration-200"
                :class="{ 'rotate-90': isManageSectionOpen }"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M7.293 4.293a1 1 0 011.414 0L14.414 10l-5.707 5.707a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div v-show="isManageSectionOpen" class="space-y-1 pl-4">
              <router-link 
                v-for="item in phoneMenuConfig.manage" 
                :key="item.path"
                :to="item.path"
                class="block px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                :class="{ 'text-blue-600 bg-blue-50': isRouteActive(item.path) }"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>

          <!-- Configure Section -->
          <div class="pl-8 mt-4">
            <div 
              class="flex items-center py-2 px-4 text-gray-600 cursor-pointer justify-between"
              @click="toggleConfigureSection"
            >
              <span class="text-sm font-medium">CONFIGURE</span>
              <svg 
                class="w-4 h-4 transform transition-transform duration-200"
                :class="{ 'rotate-90': isConfigureSectionOpen }"
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M7.293 4.293a1 1 0 011.414 0L14.414 10l-5.707 5.707a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div v-show="isConfigureSectionOpen" class="space-y-1 pl-4">
              <router-link 
                v-for="item in phoneMenuConfig.configure" 
                :key="item.path"
                :to="item.path"
                class="block px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                :class="{ 'text-blue-600 bg-blue-50': isRouteActive(item.path) }"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
        </template>
      </div>

      <!-- Messaging -->
      <router-link 
        to="/messaging"
        class="px-4 py-2 flex items-center space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        :class="{ 'bg-gray-50': isRouteActive('/messaging') }"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" stroke-width="2"/>
        </svg>
        <span>Messaging</span>
      </router-link>

      <!-- Voice -->
      <router-link 
        to="/voice"
        class="px-4 py-2 flex items-center space-x-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        :class="{ 'bg-gray-50': isRouteActive('/voice') }"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-width="2"/>
        </svg>
        <span>Voice</span>
      </router-link>
    </nav>

    <!-- Bottom Section -->
    <div class="p-4 border-t">
      <div class="flex items-center space-x-2 text-gray-700">
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-width="2"/>
        </svg>
        <span>Docs and Support</span>
        <button class="ml-auto">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 菜单配置
const phoneMenuConfig = {
  manage: [
    { name: 'Active numbers', path: '/phone-numbers/active' },
    { name: 'Released numbers', path: '/phone-numbers/released' },
    { name: 'Buy a number', path: '/phone-numbers/buy' },
    { name: 'Verified Caller IDs', path: '/phone-numbers/verified-caller-ids' },
    { name: 'TwiML apps', path: '/phone-numbers/twiml-apps' }
  ],
  configure: [
    { name: 'Port & Host', path: '/phone-numbers/port' },
    { name: 'Regulatory Compliance', path: '/phone-numbers/regulatory' }
  ]
}

const isPhoneNumbersOpen = computed(() => 
  route.path.startsWith('/phone-numbers')
)

// 添加 MANAGE 和 CONFIGURE 的展开状态控制
const isManageSectionOpen = ref(true)
const isConfigureSectionOpen = ref(true)

const toggleManageSection = () => {
  isManageSectionOpen.value = !isManageSectionOpen.value
}

const toggleConfigureSection = () => {
  isConfigureSectionOpen.value = !isConfigureSectionOpen.value
}

const isRouteActive = (path: string) => {
  return route.path.startsWith(path)
}
</script>

<style scoped>
.router-link-active {
  @apply bg-blue-50 text-blue-600;
}
</style>