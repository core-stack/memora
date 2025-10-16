import { MutationResult } from '@zilliz/milvus2-sdk-node';

export class VectorMutationError extends Error {
  constructor(message?: string, mutationResult?: MutationResult) {
    super(message + JSON.stringify(mutationResult));
    
  }
}