import { CrudController } from '@/generics';
import {
  CreateKnowledge, createKnowledgeSchema, Knowledge, knowledgeFilterSchema, UpdateKnowledge,
  updateKnowledgeSchema
} from '@memora/schemas';
import { Controller } from '@nestjs/common';

import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
export class KnowledgeController extends CrudController<Knowledge, CreateKnowledge, UpdateKnowledge> {
  constructor(protected readonly service: KnowledgeService) {
    super(
      service,
      knowledgeFilterSchema,
      createKnowledgeSchema,
      updateKnowledgeSchema
    );
  }
}
