// src/store/botEngine.ts

import { defineStore } from 'pinia'

interface Intent {
  name: string
  confidence: number
}

interface NodeData {
  label?: string
  service?: string
  intents: Intent[]
}

interface State {
  currentNode: NodeData | null
  nodes: NodeData[]
}

export const useBotEngineStore = defineStore('botEngine', {
  state: (): State => ({
    currentNode: null,
    nodes: []
  }),
  actions: {
    setCurrentNode(node: NodeData) {
      this.currentNode = node
    },
    setNodes(nodes: NodeData[]) {
      this.nodes = nodes
    },
    updateNode(updatedNode: NodeData) {
      const index = this.nodes.findIndex(node => node.label === updatedNode.label)
      if (index !== -1) {
        this.nodes[index] = updatedNode
      }
    },
    transitionToNode(nextNodeId: string) {
      const nextNode = this.nodes.find(node => node.label === nextNodeId)
      if (nextNode) {
        this.setCurrentNode(nextNode)
      }
    }
  }
})