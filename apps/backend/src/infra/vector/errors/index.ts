import { MutationResult } from '@zilliz/milvus2-sdk-node';

export class VectorStoreError extends Error {
  constructor(mutationResult?: MutationResult, message?: string) {
    super(message + JSON.stringify(mutationResult));
    
  }
}