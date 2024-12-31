// tests/unit/NLPIntentNode.spec.ts
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NLPIntentNode from '@/components/nodes/NLPIntentNode.vue'
import type { NodeData } from '@/types'

// 修改接口定义，不再继承 NodeData
interface NLPNodeData {
  label?: string
  service?: string
  intents: Array<{
    name: string
    confidence: number
  }>
  description?: string
}

interface NLPNodeProps {
  id: string
  data: NLPNodeData
  isSelected?: boolean
}

describe('NLPIntentNode.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('mock parse intent', async () => {
    const wrapper = mount(NLPIntentNode, {
      props: {
        id: '1',
        data: {
          label: 'NLP Intent',
          service: 'dialogflow',
          intents: [],
          description: 'NLP Intent Node' // 添加可选的 description
        }
      }
    })

    // 找到并点击 Mock Parse Intent 按钮
    const button = wrapper.find('button.text-blue-500')
    await button.trigger('click')
    
    const vm = wrapper.vm as any
    expect(vm.nodeData.intents).toEqual([
      { name: 'greeting', confidence: 0.95 }
    ])
  })
})