// src/types/test.ts
export interface TestCase {
  id: string
  name: string
  description?: string
  inputs: TestInput[]
  expectedOutputs: TestOutput[]
  variables?: Record<string, any>
}

export interface TestInput {
  type: 'message' | 'event' | 'variable'
  value: any
  timestamp?: Date
  metadata?: Record<string, any>
}

export interface TestOutput {
  type: 'message' | 'action' | 'state'
  value: any
  nodeId?: string
  timestamp?: Date
}

export interface TestResult {
  testCaseId: string
  success: boolean
  actualOutputs: TestOutput[]
  errors?: string[]
  duration: number
  timestamp: Date
}

export interface SimulationStep {
  nodeId: string
  type: string
  input?: any
  output?: any
  variables: Record<string, any>
  timestamp: Date
}

export interface SimulationResults {
  steps: SimulationStep[]
  variables: Record<string, any>
  success: boolean
  errors?: string[]
  duration: number
}