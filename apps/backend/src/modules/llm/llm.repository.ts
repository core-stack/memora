import { llm } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';

import { CreateLLMEntity, LLMEntity, UpdateLLMEntity } from './llm.entity';

export class LLMRepository extends DrizzleGenericRepository<
  typeof llm, LLMEntity, CreateLLMEntity, UpdateLLMEntity
> {
  constructor() {
    super(llm);
  }
}