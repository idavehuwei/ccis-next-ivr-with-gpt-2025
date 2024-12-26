import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/ivr/flow',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          nodes: [
            {
              id: '1',
              type: 'start',
              label: '开始',
              position: { x: 100, y: 100 },
            },
            {
              id: '2',
              type: 'menu',
              label: '主菜单',
              position: { x: 100, y: 200 },
              data: {
                options: [
                  { key: '1', value: '账单查询' },
                  { key: '2', value: '人工服务' },
                ],
              },
            },
            // ... 更多节点
          ],
          edges: [
            {
              id: 'e1-2',
              source: '1',
              target: '2',
            },
            // ... 更多连接
          ],
        },
        message: 'success',
      }
    },
  },
  {
    url: '/api/ivr/gpt-config',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          maxTokens: 2000,
          systemPrompt: '你是一个专业的客服助手',
        },
        message: 'success',
      }
    },
  },
] as MockMethod[] 