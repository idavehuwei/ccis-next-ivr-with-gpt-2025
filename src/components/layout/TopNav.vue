<!-- src/components/layout/TopNav.vue -->
<template>
    <header class="bg-[#06033A] text-white h-14 flex items-center px-4 justify-between">
      <!-- Left Section -->
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-3">
          <!-- Logo -->
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke-width="2"/>
          </svg>
          <!-- Console Text -->
          <span class="text-sm">Console</span>
        </div>
  
        <div class="flex items-center space-x-2">
          <!-- Account Selector -->
          <div class="flex items-center">
            <button class="flex items-center space-x-1 px-3 py-1 hover:bg-white/10 rounded">
              <span>My first IVR account</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <!-- Trial Badge -->
          <div class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-sm flex items-center space-x-1">
            <span>Trial: $0.00</span>
            <button class="text-xs bg-emerald-700 text-white px-2 py-0.5 rounded">
              Upgrade
            </button>
          </div>
        </div>
      </div>
  
      <!-- Right Section -->
      <div class="flex items-center space-x-4">
        <!-- Search Bar -->
        <div class="relative">
          <input
            type="text"
            placeholder="Jump to..."
            class="w-80 px-4 py-1.5 bg-white/10 rounded text-sm text-white placeholder-gray-400"
          />
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </span>
        </div>
  
        <!-- Navigation Links -->
        <div class="flex items-center space-x-4">
          <button class="hover:bg-white/10 px-3 py-1 rounded">Account</button>
          <button class="hover:bg-white/10 px-3 py-1 rounded">Billing</button>
          <!-- User Menu -->
          <div class="flex items-center space-x-2 hover:bg-white/10 px-3 py-1 rounded cursor-pointer">
            <svg class="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            <span>Bruce McIntyre</span>
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </header>
  </template>