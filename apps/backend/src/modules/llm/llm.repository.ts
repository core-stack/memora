import { eq } from 'drizzle-orm';

import { knowledgeLLM, llm } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';

import { CreateLLMEntity, LLMEntity, UpdateLLMEntity } from './llm.entity';

export class LLMRepository extends DrizzleGenericRepository<
  typeof llm, LLMEntity, CreateLLMEntity, UpdateLLMEntity
> {
  constructor() {
    super(llm);
  }

  async findByKnowledge(knowledgeId: string): Promise<LLMEntity[]> {
    const res = await this.db.select().from(llm)
      .leftJoin(knowledgeLLM, eq(llm.id, knowledgeLLM.llmId))
      .where(eq(knowledgeLLM.knowledgeId, knowledgeId));

    return res.map(({ llm }) => llm as LLMEntity);
  }
}