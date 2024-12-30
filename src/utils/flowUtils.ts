// src/utils/flowUtils.ts
export function generateFlowDefinition(nodes: any[], edges: any[]) {
    // Convert nodes to states
    const states = nodes.map(node => {
      // Get node component instance
      const nodeComponent = node.__vueParentComponent?.ctx
      
      // Use toFlowState if available, otherwise do basic conversion
      if (nodeComponent?.toFlowState) {
        return nodeComponent.toFlowState()
      }
      
      return {
        name: node.id,
        type: node.type,
        properties: {
          ...node.data,
          offset: node.position
        },
        transitions: []
      }
    })
  
    // Add transitions from edges
    edges.forEach(edge => {
      const sourceState = states.find(s => s.name === edge.source)
      if (sourceState) {
        sourceState.transitions.push({
          event: edge.sourceHandle || 'success',
          next: edge.target
        })
      }
    })
  
    return {
      flags: {
        allow_concurrent_calls: true
      },
      description: "Generated Flow",
      states,
      initial_state: nodes[0]?.id
    }
  }