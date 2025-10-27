import { llm } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';

import { LLM } from './llm.schema';

export class LLMRepository extends DrizzleGenericRepository<typeof llm, LLM> {
  constructor() {
    super(llm);
  }

  override create(data: Partial<LLM>): Promise<LLM> {
    return super.create(data);
  }
}