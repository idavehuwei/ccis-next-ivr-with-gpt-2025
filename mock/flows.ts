// mock/flows.ts
import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/flows',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: [
          {
            id: 1,
            name: '客户支持 IVR',
            description: '具有语音识别功能的主要客户支持流程',
            status: 'Published',
            lastEdited: '2 hours ago'
          },
          {
            id: 2,
            name: '销售咨询处理',
            description: '将销售咨询路由到相应部门',
            status: 'Draft',
            lastEdited: '1 day ago'
          },
          {
            id: 3,
            name: '预约调度',
            description: '自动预约和提醒',
            status: 'Published',
            lastEdited: '3 days ago'
          },
          {
            id: 4,
            name: '调查流程',
            description: '通话后的客户满意度调查',
            status: 'Draft',
            lastEdited: '1 week ago'
          }
        ],
        message: 'success'
      }
    },
  },
] as MockMethod[]