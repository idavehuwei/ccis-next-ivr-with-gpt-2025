<!-- src/views/phone/PhoneNumbers.vue -->
<template>
  <div class="phone-numbers">
    <div class="mb-4">
      <h2 class="text-xl font-bold">Active Numbers</h2>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2">电话号码</th>
            <th class="px-4 py-2">状态</th>
            <th class="px-4 py-2">类型</th>
            <th class="px-4 py-2">地区</th>
            <th class="px-4 py-2">创建时间</th>
            <th class="px-4 py-2">月费</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in phoneList" :key="item.id" class="border-b">
            <td class="px-4 py-2">{{ item.phoneNumber }}</td>
            <td class="px-4 py-2">
              <span :class="item.status === 'active' ? 'text-green-600' : 'text-red-600'">
                {{ item.status }}
              </span>
            </td>
            <td class="px-4 py-2">{{ item.type }}</td>
            <td class="px-4 py-2">{{ item.region }}</td>
            <td class="px-4 py-2">{{ item.createTime }}</td>
            <td class="px-4 py-2">¥{{ item.monthlyFee }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/phone'

const phoneList = ref([])

const getPhoneNumbers = async () => {
  try {
    const { data } = await api.getPhoneNumbers()
    if (data.code === 200) {
      phoneList.value = data.data.list
    }
  } catch (error) {
    console.error('获取电话号码列表失败:', error)
  }
}

onMounted(() => {
  getPhoneNumbers()
})
</script>