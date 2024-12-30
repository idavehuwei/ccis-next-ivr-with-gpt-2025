import { FLOW_CONSTANTS, FLOW_STATE_TYPES } from "@/config/constants";
import { FlowValidationError } from "@/types/errors";
import { FlowDefinition, FlowState, FlowTransition } from "@/types/flow";

// src/utils/validation.ts
export class FlowValidator {
    static validateFlow(definition: FlowDefinition): void {
      // Basic structure validation
      if (!definition.states || !Array.isArray(definition.states)) {
        throw new FlowValidationError('Flow must have states array');
      }
  
      if (!definition.initial_state) {
        throw new FlowValidationError('Flow must have initial_state');
      }
  
      if (definition.states.length > FLOW_CONSTANTS.MAX_STATES) {
        throw new FlowValidationError(`Flow cannot have more than ${FLOW_CONSTANTS.MAX_STATES} states`);
      }
  
      // Validate state names and references
      const stateNames = new Set(definition.states.map(state => state.name));
      if (!stateNames.has(definition.initial_state)) {
        throw new FlowValidationError(`Initial state ${definition.initial_state} not found in states`);
      }
  
      // Validate individual states
      for (const state of definition.states) {
        this.validateState(state, stateNames);
      }
    }
  
    private static validateState(state: FlowState, validStateNames: Set<string>): void {
      if (!state.name || typeof state.name !== 'string') {
        throw new FlowValidationError('State must have a valid name');
      }
  
      if (!state.type || !Object.values(FLOW_STATE_TYPES).includes(state.type as any)) {
        throw new FlowValidationError(`Invalid state type: ${state.type}`);
      }
  
      if (!state.transitions || !Array.isArray(state.transitions)) {
        throw new FlowValidationError(`State ${state.name} must have transitions array`);
      }
  
      if (state.transitions.length > FLOW_CONSTANTS.MAX_TRANSITIONS) {
        throw new FlowValidationError(
          `State ${state.name} cannot have more than ${FLOW_CONSTANTS.MAX_TRANSITIONS} transitions`
        );
      }
  
      // Validate transitions
      for (const transition of state.transitions) {
        this.validateTransition(transition, state.name, validStateNames);
      }
    }
  
    private static validateTransition(
      transition: FlowTransition, 
      stateName: string, 
      validStateNames: Set<string>
    ): void {
      if (!transition.event) {
        throw new FlowValidationError(
          `Transition in state ${stateName} must have an event`
        );
      }
  
      if (transition.next && !validStateNames.has(transition.next)) {
        throw new FlowValidationError(
          `Invalid transition target ${transition.next} in state ${stateName}`
        );
      }
    }
  }