// src/api/types.ts
export interface CreateFlowRequest {
    definition: any;
    commitMessage?: string;
    status?: 'draft' | 'published';
  }
  
  export interface UpdateFlowRequest {
    definition: any;
    commitMessage?: string;
    status?: 'draft' | 'published';
  }
  
  export interface ExecuteFlowRequest {
    variables?: Record<string, any>;
    triggerEvent?: string;
  }