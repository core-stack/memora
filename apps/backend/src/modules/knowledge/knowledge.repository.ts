import { knowledge } from '@/db/schema';
import { GenericRepository } from '@/generics';
import { Knowledge, UpdateKnowledge } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

import { CreateKnowledge } from './knowledge.schema';

@Injectable()
export class KnowledgeRepository extends GenericRepository<
  typeof knowledge,
  Knowledge,
  CreateKnowledge,
  UpdateKnowledge
> {
  constructor() {
    super(knowledge);
  }
}