import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/phone/numbers',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          total: 100,
          list: [
            {
              id: '1',
              phoneNumber: '+86 13800138000',
              status: 'active',
              type: '客服热线',
              region: '上海',
              createTime: '2024-01-01',
              monthlyFee: '299',
            },
            {
              id: '2',
              phoneNumber: '+86 13800138001',
              status: 'active',
              type: '售后支持',
              region: '北京',
              createTime: '2024-01-02',
              monthlyFee: '299',
            },
            {
              id: '3',
              phoneNumber: '+86 13800138002',
              status: 'inactive',
              type: '销售热线',
              region: '广州',
              createTime: '2024-01-03',
              monthlyFee: '299',
            },
          ],
        },
        message: 'success',
      }
    },
  },
] as MockMethod[] 