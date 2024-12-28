// src/types/flow.ts
export interface Position {
    x: number
    y: number
  }
  
  export interface FlowTemplate {
    name: string
    description: string
    nodes: FlowNode[]
    edges: FlowEdge[]
  }
  
  export interface FlowNode {
    id: string
    type: string
    position: Position
    data: NodeData
    style?: Record<string, any>
    selected?: boolean
  }
  
  export interface NodeData {
    label?: string
    [key: string]: any
  }
  
  export interface FlowEdge {
    id: string
    source: string
    target: string
    sourceHandle?: string
    targetHandle?: string
    type?: string
    animated?: boolean
    style?: Record<string, any>
    data?: EdgeData
    selected?: boolean
  }
  
  export interface EdgeData {
    label?: string
    selectable?: boolean
    hoverable?: boolean
  }
  
  export interface Viewport {
    x: number
    y: number
    zoom: number
  }