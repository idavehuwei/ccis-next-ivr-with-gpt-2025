// tests/unit/TriggerNode.spec.ts
import { mount } from '@vue/test-utils'
import TriggerNode from '@/components/nodes/TriggerNode.vue'

describe('TriggerNode.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(TriggerNode, {
      props: {
        id: 'test-node',
        data: {
          label: 'Test Trigger',
          triggerType: 'incoming_message',
          channel: 'sms',
          webhookConfig: {
            url: '',
            authType: '',
            username: '',
            password: '',
            token: ''
          },
          scheduleConfig: {
            type: 'interval',
            interval: 5,
            unit: 'minutes',
            cron: '* * * * *',
            time: ''
          }
        },
        isSelected: false
      }
    })
  })

  it('renders the correct label', () => {
    expect(wrapper.find('.node-label').text()).toBe('Test Trigger')
  })

  it('displays trigger types correctly', () => {
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(4)
  })

  it('updates trigger type on button click', async () => {
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    expect(wrapper.vm.nodeData.triggerType).toBe('incoming_call')
  })

  it('displays channels for message/call triggers', async () => {
    await wrapper.setData({ nodeData: { triggerType: 'incoming_message' } })
    expect(wrapper.findAll('.channel-button').length).toBe(3)
  })

  it('updates channel on button click', async () => {
    await wrapper.setData({ nodeData: { triggerType: 'incoming_message' } })
    const buttons = wrapper.findAll('.channel-button')
    await buttons[1].trigger('click')
    expect(wrapper.vm.nodeData.channel).toBe('whatsapp')
  })

  it('displays webhook configuration inputs', async () => {
    await wrapper.setData({ nodeData: { triggerType: 'webhook' } })
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('displays schedule configuration inputs', async () => {
    await wrapper.setData({ nodeData: { triggerType: 'schedule' } })
    expect(wrapper.find('select').exists()).toBe(true)
  })
})