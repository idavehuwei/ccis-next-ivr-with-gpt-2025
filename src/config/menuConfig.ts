// src/config/menuConfig.ts
export const phoneMenuConfig = {
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