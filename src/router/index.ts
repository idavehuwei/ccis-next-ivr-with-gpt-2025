// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PhoneLayout from '../views/phone/PhoneLayout.vue'
import PhoneNumbers from '../views/phone/PhoneNumbers.vue'
import PhoneNumberDetail from '../views/phone/PhoneNumberDetail.vue'
import ReleasedNumbers from '../views/phone/ReleasedNumbers.vue'
import BuyNumber from '../views/phone/BuyNumber.vue'
import VerifiedCallerIds from '../views/phone/VerifiedCallerIds.vue'
import PortAndHost from '../views/phone/PortAndHost.vue'
import RegulatoryCompliance from '../views/phone/RegulatoryCompliance.vue'
 
import Messaging from '../views/messaging/Messaging.vue'
import Studio from '../views/studio/Studio.vue'
import StudioOverview from '../views/studio/Overview.vue'
import StudioFlows from '../views/studio/Flows.vue'
import FlowDesigner from '../views/studio/FlowDesigner.vue'
import Voice from '../views/voice/Voice.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  
  {
    path: '/phone-numbers',
    component: PhoneLayout,
    children: [
      {
        path: '',
        redirect: '/phone-numbers/active'
      },
      {
        path: 'active',
        name: 'PhoneNumbers',
        component: PhoneNumbers
      },
      {
        path: 'active/:id',
        name: 'PhoneNumberDetail',
        component: PhoneNumberDetail
      },
      {
        path: 'released',
        name: 'ReleasedNumbers',
        component: ReleasedNumbers
      },
      {
        path: 'buy',
        name: 'BuyNumber',
        component: BuyNumber
      },
      {
        path: 'verified-caller-ids',
        name: 'VerifiedCallerIds',
        component: VerifiedCallerIds
      },
      {
        path: 'port',
        name: 'PortAndHost',
        component: PortAndHost
      },
      {
        path: 'regulatory',
        name: 'RegulatoryCompliance',
        component: RegulatoryCompliance
      }
    ]
  },

  {
    path: '/messaging',
    name: 'Messaging',
    component: Messaging,
    children: [
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('../views/messaging/Messages.vue')
      },
      {
        path: 'services',
        name: 'Services',
        component: () => import('../views/messaging/Services.vue')
      }
    ]
  },
  {
    path: '/studio',
    component: Studio,
    children: [
      {
        path: '',
        name: 'StudioOverview',
        component: StudioOverview
      },
      {
        path: 'flows',
        name: 'StudioFlows',
        component: StudioFlows
      },
      {
        path: 'flows/:id/edit',
        name: 'FlowDesigner',
        component: FlowDesigner
      },
      {
        path: 'flows/templates',
        name: 'FlowTemplates',
        component: () => import('../views/studio/FlowTemplates.vue')
      }
    ]
  },
  {
    path: '/voice',
    name: 'Voice',
    component: Voice,
    children: [
      {
        path: 'calls',
        name: 'Calls',
        component: () => import('../views/voice/Calls.vue')
      },
      {
        path: 'conferences',
        name: 'Conferences',
        component: () => import('../views/voice/Conferences.vue')
      },
      {
        path: 'recordings',
        name: 'Recordings',
        component: () => import('../views/voice/Recordings.vue')
      }
    ]
  },

  {
    path: '/functions',
    component: () => import('../views/functions/FunctionsLayout.vue'), 
    children: [
      {
        path: '',
        name: 'FunctionsOverview',
        component: () => import('../views/functions/FunctionsOverview.vue')
      },
      
      {
        path: '/functions/:serviceName/editor',
        name: 'ServiceEditor',
        component: () => import('../views/functions/ServiceEditor.vue')
      }
    ]
  }

]

// 路由器配置
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 导航守卫
router.beforeEach((to, from, next) => {
  // 判断是否需要登录
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = localStorage.getItem('token')

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export { router }