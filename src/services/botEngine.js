// src/services/botEngine.js

import { createStore } from 'vuex'

const store = createStore({
  state: {
    currentNode: null,
    nodes: []
  },
  mutations: {
    setCurrentNode(state, node) {
      state.currentNode = node
    },
    setNodes(state, nodes) {
      state.nodes = nodes
    },
    updateNode(state, updatedNode) {
      const index = state.nodes.findIndex(node => node.id === updatedNode.id)
      if (index !== -1) {
        state.nodes[index] = updatedNode
      }
    }
  },
  actions: {
    transitionToNode({ commit, state }, nextNodeId) {
      const nextNode = state.nodes.find(node => node.id === nextNodeId)
      if (nextNode) {
        commit('setCurrentNode', nextNode)
      }
    }
  }
})

export default store