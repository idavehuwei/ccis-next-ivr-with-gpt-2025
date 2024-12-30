// src/handlers/httpRequestHandler.ts
import { BaseStateHandler } from './baseHandler';
import { FLOW_EVENTS } from '../config/constants';
import { FlowState, ExecutionContext, ExecutionResult } from '@/types/flow';

export class HttpRequestHandler extends BaseStateHandler {
  readonly type = 'http-request';

  async execute(
    state: FlowState,
    context: ExecutionContext
  ): Promise<ExecutionResult> {
    this.validateProperties(state, ['url', 'method']);

    const { url, method, headers = {}, body = null } = state.properties;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
      });

      const data = await response.json();

      return {
        event: FLOW_EVENTS.REQUEST_SUCCESS,
        data: {
          statusCode: response.status,
          data,
          headers: Object.fromEntries(response.headers.entries())
        }
      };
    } catch (error) {
      return {
        event: FLOW_EVENTS.REQUEST_FAILURE,
        error: error as Error
      };
    }
  }
}
