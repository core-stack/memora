export abstract class StateStore<T = any> {
  abstract get(key: string): T | Promise<T>;
  abstract set(key: string, state: T): this | Promise<this>;
}

export interface PipelineContext {
  input: string;
  knowledgeId: string;
  state: StateStore;
}
