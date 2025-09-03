


import { knowledge } from '@/db/schema';
import { env } from '@/env';
import { GenericService } from '@/generics';
import { Knowledge, UpdateKnowledge } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

import { KnowledgeRepository } from './knowledge.repository';
import { CreateKnowledge } from './knowledge.schema';

@Injectable()
export class KnowledgeService extends GenericService<
  typeof knowledge,
  Knowledge,
  CreateKnowledge,
  UpdateKnowledge
> {
  constructor(protected readonly repository: KnowledgeRepository) {
    super(repository);
  }

  protected override beforeCreate = (data: CreateKnowledge): CreateKnowledge => {
    data.tenantId = env.TENANT_ID;
    return data;
  }
}
