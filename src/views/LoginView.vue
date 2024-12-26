<!-- src/views/LoginView.vue -->
<template>
    <div class="min-h-screen flex flex-col justify-center items-center bg-white px-4">
      <!-- Card Container -->
      <div class="w-full max-w-[400px] bg-white rounded-lg shadow-lg p-8 mb-8">
        <!-- Logo -->
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-[#1c252e] mb-2">CCIS Next IVR with GPT</h1>
        </div>
  
        <!-- Login Form -->
        <div class="space-y-6">
          <h2 class="text-xl text-gray-700 text-center">Log in</h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <input
                type="email"
                required
                v-model="email"
                placeholder="Email address"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>
  
            <button
              type="submit"
              class="w-full py-2 px-4 bg-[#0263E0] hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Continue
            </button>
          </form>
  
          <div class="text-center text-sm text-gray-600">
            Don't have an account? 
            <a href="#" class="text-[#0263E0] hover:underline">Sign up</a>
          </div>
        </div>
      </div>
  
      <!-- Footer Links -->
      <div class="text-center text-sm text-gray-500 space-y-2">
        <div class="space-x-2">
          <a href="#" class="text-[#0263E0] hover:underline">Terms of Service</a>
          <span>|</span>
          <a href="#" class="text-[#0263E0] hover:underline">Privacy Policy</a>
        </div>
        <div>
          © {{ new Date().getFullYear() }} All rights reserved.
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const email = ref('')
  
  const handleSubmit = async () => {
    try {
      // 模拟登录
      localStorage.setItem('token', 'demo-token')
      await router.push('/home')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
  </script>
  
  <style scoped>
  input::placeholder {
    color: #9CA3AF;
  }
  
  /* 添加输入框阴影效果 */
  input:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  
  /* 按钮点击效果 */
  button:active {
    transform: scale(0.98);
  }
  </style>