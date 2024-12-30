// src/tests/fixtures/sampleFlows.ts
export const sampleFlow = {
    flags: {
      allow_concurrent_calls: true
    },
    description: "Sample Test Flow",
    states: [
      {
        name: "Trigger",
        type: "trigger",
        properties: {
          offset: { x: 0, y: 0 }
        },
        transitions: [
          { event: "incomingMessage", next: "say_hello" }
        ]
      },
      {
        name: "say_hello",
        type: "say-play",
        properties: {
          say: "Hello, World!",
          loop: 1,
          offset: { x: 100, y: 100 }
        },
        transitions: [
          { event: "audioComplete" }
        ]
      }
    ],
    initial_state: "Trigger"
  };