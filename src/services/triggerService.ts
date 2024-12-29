import { ref } from 'vue'
import type { TriggerConfig, TriggerCondition, VariableMapping } from '@/types/flow'

export class TriggerService {
  // 检查消息是否满足触发条件
  static async checkConditions(
    message: string, 
    conditions: TriggerCondition[],
    nlpService?: any // 预留NLP服务接口
  ): Promise<boolean> {
    if (!conditions.length) return true
    
    const results = await Promise.all(conditions.map(async condition => {
      switch (condition.type) {
        case 'keyword':
          return message.includes(condition.value)
          
        case 'regex':
          try {
            return new RegExp(condition.value).test(message)
          } catch (e) {
            console.error('Invalid regex:', e)
            return false
          }
          
        case 'intent':
          if (nlpService) {
            try {
              const intent = await nlpService.detectIntent(message)
              return intent === condition.value
            } catch (e) {
              console.error('NLP service error:', e)
              return false
            }
          }
          return false
          
        default:
          return false
      }
    }))
    
    return results.some(result => result)
  }

  // 处理变量映射
  static processVariableMappings(
    input: Record<string, any>,
    mappings: VariableMapping[]
  ): Record<string, any> {
    const result: Record<string, any> = {}
    
    mappings.forEach(mapping => {
      if (input.hasOwnProperty(mapping.source)) {
        // 支持嵌套属性路径
        const value = mapping.source.split('.').reduce(
          (obj, key) => obj?.[key],
          input
        )
        if (value !== undefined) {
          result[mapping.target] = value
        }
      }
    })
    
    return result
  }

  // 验证触发器配置
  static validateConfig(config: TriggerConfig): string[] {
    const errors: string[] = []
    
    if (!config.channel) {
      errors.push('必须选择触发渠道')
    }

    config.conditions.forEach((condition, index) => {
      if (!condition.type) {
        errors.push(`条件 ${index + 1} 必须指定类型`)
      }
      if (!condition.value) {
        errors.push(`条件 ${index + 1} 必须指定值`)
      }
    })

    config.variableMappings.forEach((mapping, index) => {
      if (!mapping.source) {
        errors.push(`映射 ${index + 1} 必须指定来源字段`)
      }
      if (!mapping.target) {
        errors.push(`映射 ${index + 1} 必须指定目标变量`)
      }
    })

    return errors
  }
} 