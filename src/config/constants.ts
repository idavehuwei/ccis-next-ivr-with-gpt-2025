// src/config/constants.ts
export const FLOW_CONSTANTS = {
    MAX_STATES: 100,
    MAX_TRANSITIONS: 10,
    MAX_CONCURRENT_EXECUTIONS: 5,
    EXECUTION_TIMEOUT: 30000, // 30 seconds
  } as const;
  
  export const FLOW_STATE_TYPES = {
    TRIGGER: 'trigger',
    SAY_PLAY: 'say-play',
    GATHER_INPUT: 'gather-input',
    SEND_MESSAGE: 'send-message',
    CONDITION: 'condition',
    HTTP_REQUEST: 'http-request',
    EXECUTE_FUNCTION: 'execute-function',
  } as const;
  
  export const FLOW_EVENTS = {
    INCOMING_MESSAGE: 'incomingMessage',
    INCOMING_CALL: 'incomingCall',
    INCOMING_REQUEST: 'incomingRequest',
    AUDIO_COMPLETE: 'audioComplete',
    INPUT_RECEIVED: 'inputReceived',
    REQUEST_SUCCESS: 'requestSuccess',
    REQUEST_FAILURE: 'requestFailure',
    CONDITION_TRUE: 'conditionTrue',
    CONDITION_FALSE: 'conditionFalse',
    FUNCTION_SUCCESS: 'functionSuccess',
    FUNCTION_FAILURE: 'functionFailure',
  } as const;