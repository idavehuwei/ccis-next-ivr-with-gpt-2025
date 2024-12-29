import { reactive } from 'vue'

export interface Variable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  description?: string
  defaultValue?: any
  value?: any
}

class VariableService {
  private variables = reactive<Record<string, Variable>>({})

  // 注册变量
  registerVariable(variable: Variable) {
    this.variables[variable.name] = {
      ...variable,
      value: variable.defaultValue
    }
  }

  // 获取变量值
  getValue(name: string) {
    return this.variables[name]?.value
  }

  // 设置变量值
  setValue(name: string, value: any) {
    if (this.variables[name]) {
      this.variables[name].value = value
    }
  }

  // 获取所有变量
  getAllVariables() {
    return Object.values(this.variables)
  }

  // 评估条件
  evaluateCondition(condition: {
    variable: string
    operator: string
    value: any
  }) {
    const variableValue = this.getValue(condition.variable)
    
    switch (condition.operator) {
      case 'equals':
        return variableValue === condition.value
      case 'not_equals':
        return variableValue !== condition.value
      case 'contains':
        return String(variableValue).includes(String(condition.value))
      case 'not_contains':
        return !String(variableValue).includes(String(condition.value))
      case 'greater_than':
        return Number(variableValue) > Number(condition.value)
      case 'less_than':
        return Number(variableValue) < Number(condition.value)
      default:
        return false
    }
  }

  // 添加条件组评估方法
  evaluateConditionGroup(group: {
    operator: string
    conditions: Array<{
      variable: string
      operator: string
      value: any
    }>
  }) {
    const results = group.conditions.map(condition => 
      this.evaluateCondition(condition)
    )
    
    return group.operator === 'AND' 
      ? results.every(Boolean)
      : results.some(Boolean)
  }

  // 添加多条件组评估方法
  evaluateConditions(groups: Array<{
    operator: string
    conditions: Array<{
      variable: string
      operator: string
      value: any
    }>
  }>) {
    return groups.map(group => ({
      result: this.evaluateConditionGroup(group),
      group
    }))
  }
}

export const variableService = new VariableService() 