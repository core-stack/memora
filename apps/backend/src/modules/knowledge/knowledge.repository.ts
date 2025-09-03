import { knowledge } from '@/db/schema';
import { GenericRepository } from '@/generics';
import { CreateKnowledge, Knowledge, UpdateKnowledge } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

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