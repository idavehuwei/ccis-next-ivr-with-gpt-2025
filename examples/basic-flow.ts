// examples/basic-flow.ts
import { FlowStore, FlowExecutor } from '../src';

async function runBasicFlow() {
  const store = new FlowStore();
  const executor = new FlowExecutor(store);

  const flow = {
    flags: {
      allow_concurrent_calls: true
    },
    description: "Basic Demo Flow",
    states: [
      {
        name: "Trigger",
        type: "trigger",
        properties: {},
        transitions: [
          { event: "incomingMessage", next: "greet" }
        ]
      },
      {
        name: "greet",
        type: "say-play",
        properties: {
          say: "Welcome to the demo!"
        },
        transitions: [
          { event: "audioComplete", next: "collect_name" }
        ]
      },
      {
        name: "collect_name",
        type: "gather-input",
        properties: {
          prompt: "What's your name?",
          timeout: 5000
        },
        transitions: [
          { event: "inputReceived", next: "farewell" }
        ]
      },
      {
        name: "farewell",
        type: "say-play",
        properties: {
          say: "Thanks for trying the demo!"
        },
        transitions: [
          { event: "audioComplete" }
        ]
      }
    ],
    initial_state: "Trigger"
  };

  // Create and execute flow
  const flowId = 'demo-flow';
  await store.createFlow(flowId, flow);
  await executor.executeFlow(flowId);
}

runBasicFlow().catch(console.error);