import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NLPIntentNode from '@/components/nodes/NLPIntentNode.vue'


describe('NLPIntentNode.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('mock parse intent', async () => {
    const wrapper = mount(NLPIntentNode, {
      props: {
        id: '1',
        data: {
          intents: []
        }
      }
    })

    await wrapper.find('button[text="Mock Parse Intent"]').trigger('click')

    expect(wrapper.vm.nodeData.intents).toEqual([
      { name: 'greeting', confidence: 0.95 }
    ])
  })
})