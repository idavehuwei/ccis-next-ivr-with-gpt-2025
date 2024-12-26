<!-- src/views/phone/PhoneNumberDetail.vue -->
<template>
  <div class="px-8 py-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="text-sm text-blue-600 mb-2">
        <router-link to="/phone-numbers">Active numbers /</router-link>
      </div>
      <h1 class="text-2xl font-semibold">(912) 616-7546</h1>
    </div>

    <!-- Tab Navigation -->
    <div class="border-b mb-6">
      <nav class="flex -mb-px">
        <a
          class="px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-medium"
          >Configure</a
        >
        <a class="px-4 py-2 text-gray-500 hover:text-gray-700">Calls Log</a>
        <a class="px-4 py-2 text-gray-500 hover:text-gray-700">Messages Log</a>
        <a class="px-4 py-2 text-gray-500 hover:text-gray-700">Events Log</a>
        <a class="px-4 py-2 text-gray-500 hover:text-gray-700"
          >Regulatory Information</a
        >
      </nav>
    </div>

    <!-- Properties Section -->
    <div class="mb-6">
      <h2 class="text-xl font-medium mb-4">Properties</h2>
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6 space-y-6">
          <!-- Friendly Name -->
          <div>
            <label class="block text-sm text-gray-500 mb-1"
              >FRIENDLY NAME</label
            >
            <input
              type="text"
              v-model="phoneNumber.friendlyName"
              class="w-full p-2 border rounded-md"
            />
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-sm text-gray-500 mb-1">PHONE NUMBER</label>
            <div class="text-gray-700">+1 912 616 7546</div>
          </div>

          <!-- Phone Number SID -->
          <div>
            <label class="block text-sm text-gray-500 mb-1"
              >PHONE NUMBER SID</label
            >
            <div class="font-mono text-sm">
              PN24d21edb0601a82784b0c07aa86cc510
            </div>
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm text-gray-500 mb-1">TYPE</label>
            <div class="text-gray-700">Local</div>
          </div>

          <!-- Capabilities -->
          <div>
            <label class="block text-sm text-gray-500 mb-1">CAPABILITIES</label>
            <div class="text-gray-700">Voice, Fax, SMS, MMS</div>
          </div>

          <!-- Locality -->
          <div>
            <label class="block text-sm text-gray-500 mb-1">LOCALITY</label>
            <div class="text-gray-700">Mount Vernon, GA US</div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm text-gray-500 mb-1">NOTES</label>
            <textarea
              v-model="phoneNumber.notes"
              rows="3"
              class="w-full p-2 border rounded-md"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Voice & Fax Configuration -->
    <div class="mb-6">
      <h2 class="text-xl font-medium mb-4">Voice & Fax</h2>
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6 space-y-6">
          <!-- Routing -->
          <div>
            <div class="flex items-center space-x-2 mb-2">
              <h3 class="font-medium">Routing</h3>
              <span class="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                >Regional</span
              >
            </div>
            <div class="text-gray-600">
              United States (US1) Region inbound call routing is:
              <span class="font-medium">Active</span>
            </div>
            <button class="text-blue-600 mt-2">
              Go to other configurations ↓
            </button>
          </div>

          <!-- Accept Incoming -->
          <div>
            <label class="block text-sm text-gray-500 mb-1"
              >ACCEPT INCOMING</label
            >
            <select class="w-full p-2 border rounded-md">
              <option>Voice Calls</option>
            </select>
          </div>

          <!-- Configure With -->
          <div>
            <label class="block text-sm text-gray-500 mb-1"
              >CONFIGURE WITH</label
            >
            <select class="w-full p-2 border rounded-md">
              <option>Webhook</option>
              <option>TwiML Bin</option>
              <option>Function</option>
              <option>Studio Flow</option>
              <option>Proxy Service</option>
            </select>
          </div>

          <!-- A Call Comes In -->
          <div>
            <label class="block text-sm text-gray-500 mb-1"
              >A CALL COMES IN</label
            >
            <div class="flex space-x-2">
              <select class="w-1/4 p-2 border rounded-md">
                <option>Webhook</option>
              </select>
              <input
                type="text"
                value="https://demo.twilio.com/welcome/voice/"
                class="flex-1 p-2 border rounded-md"
              />
              <select class="w-1/4 p-2 border rounded-md">
                <option>HTTP POST</option>
              </select>
            </div>
          </div>

          <!-- Primary Handler Fails -->
          <div>
            <label class="block text-sm text-gray-500 mb-1"
              >PRIMARY HANDLER FAILS</label
            >
            <div class="flex space-x-2">
              <select class="w-1/4 p-2 border rounded-md">
                <option>Webhook</option>
              </select>
              <input type="text" class="flex-1 p-2 border rounded-md" />
              <select class="w-1/4 p-2 border rounded-md">
                <option>HTTP POST</option>
              </select>
            </div>
          </div>

          <!-- Emergency Calling -->
          <div>
            <div class="flex items-center justify-between">
              <div>
                <label class="block text-sm text-gray-500 mb-1"
                  >EMERGENCY CALLING</label
                >
                <div class="text-gray-600">
                  Emergency Address is registered.
                </div>
              </div>
              <button
                class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Remove Emergency Address
              </button>
            </div>
          </div>

          <!-- Emergency Calling Address -->
          <div>
            <label class="block text-sm text-gray-500 mb-1"
              >EMERGENCY CALLING ADDRESS</label
            >
            <div class="text-gray-600">
              320 N, New Jersey St, Indianapolis, Indiana, 46204, US
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 在 Voice & Fax Configuration 后添加 -->
    <!-- Messaging Configuration -->
    <div class="mb-6">
      <h2 class="text-xl font-medium mb-4">Messaging</h2>
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6 space-y-6">
          <!-- Routing -->
          <div>
            <div class="flex items-center space-x-2 mb-2">
              <h3 class="font-medium">Routing</h3>
              <span class="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                >Regional</span
              >
            </div>
            <div class="text-gray-600">
              United States (US1) Region inbound message routing is:
              <span class="font-medium">Active</span>
            </div>
          </div>

          <!-- Messaging Service -->
          <div>
            <label class="block text-sm text-gray-500 mb-1">
              MESSAGING SERVICE
              <span class="inline-block ml-1 text-gray-400 cursor-help">
                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </label>
            <select class="w-full p-2 border rounded-md">
              <option>Choose a Messaging Service</option>
            </select>
          </div>

          <!-- Configure With Other Handlers -->
          <div>
            <label class="block text-sm text-gray-500 mb-1"
              >CONFIGURE WITH OTHER HANDLERS</label
            >
            <div class="relative">
              <select class="w-full p-2 border rounded-md">
                <option>
                  Webhook, TwiML Bin, Function, Studio Flow, Proxy Service
                </option>
              </select>
            </div>
          </div>

          <!-- A Message Comes In -->
          <div>
            <label class="block text-sm text-gray-500 mb-1"
              >A MESSAGE COMES IN</label
            >
            <div class="flex space-x-2">
              <div class="relative w-1/4">
                <select class="w-full p-2 border rounded-md">
                  <option>Webhook</option>
                  <option>TwiML Bin</option>
                  <option>Function</option>
                  <option>Studio Flow</option>
                  <option>Proxy Service</option>
                </select>
              </div>
              <input
                type="text"
                value="https://demo.twilio.com/welcome/sms/reply/"
                class="flex-1 p-2 border rounded-md"
              />
              <select class="w-1/4 p-2 border rounded-md">
                <option>HTTP POST</option>
                <option>HTTP GET</option>
              </select>
            </div>
          </div>

          <!-- Fallback Configuration -->
          <div>
            <label class="block text-sm text-gray-500 mb-1"
              >IF THE ABOVE HANDLER FAILS</label
            >
            <div class="flex space-x-2">
              <div class="relative w-1/4">
                <select class="w-full p-2 border rounded-md">
                  <option>Webhook</option>
                  <option>TwiML Bin</option>
                  <option>Function</option>
                  <option>Studio Flow</option>
                  <option>Proxy Service</option>
                </select>
              </div>
              <input
                type="text"
                class="flex-1 p-2 border rounded-md"
                placeholder="Enter fallback URL"
              />
              <select class="w-1/4 p-2 border rounded-md">
                <option>HTTP POST</option>
                <option>HTTP GET</option>
              </select>
            </div>
          </div>

          <!-- Delivery Status Updates -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm text-gray-500"
                >MESSAGE DELIVERY STATUS UPDATES</label
              >
            </div>
            <div class="flex space-x-2">
              <div class="relative w-1/4">
                <select class="w-full p-2 border rounded-md" disabled>
                  <option>Webhook</option>
                </select>
              </div>
              <input
                type="text"
                class="flex-1 p-2 border rounded-md"
                placeholder="Enter status callback URL"
              />
              <select class="w-1/4 p-2 border rounded-md">
                <option>HTTP POST</option>
                <option>HTTP GET</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Save Bar -->
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t px-8 py-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
          Cancel
        </button>
        <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
          Release this number
        </button>
      </div>
      <button class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Save
      </button>
    </div>
  </div>

  <!-- 为底部固定栏添加底部内边距 -->
  <div class="pb-20"></div>
  
  </div>


  
</template>

<script setup lang="ts">
import { ref } from "vue";

const phoneNumber = ref({
  friendlyName: "(912) 616-7546",
  notes: "",
});
</script>
