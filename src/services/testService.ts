// src/services/testService.ts
import { TriggerService } from './triggerService'
import type { NodeData, TriggerConfig } from '@/types/flow'

export class TestService {
  static async testTrigger(
    message: string,
    nodeData: NodeData
  ): Promise<boolean> {
    const config = nodeData.triggerConfig as TriggerConfig
    
    if (!config) {
      return true
    }

    // 测试触发条件
    const conditionsMet = await TriggerService.checkConditions(
      message,
      config.conditions
    )

    if (!conditionsMet) {
      return false
    }

    // 测试变量映射
    const testInput = {
      message: {
        body: message,
        type: 'text'
      },
      contact: {
        channel: {
          type: config.channel
        }
      }
    }

    const mappedVars = TriggerService.processVariableMappings(
      testInput,
      config.variableMappings
    )

    // 返回测试结果
    return Object.keys(mappedVars).length === config.variableMappings.length
  }
}