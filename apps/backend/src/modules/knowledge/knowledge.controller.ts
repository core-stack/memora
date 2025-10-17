import { CrudController } from '@/generics';
import { Controller } from '@nestjs/common';
import {
  CreateKnowledge, createKnowledgeSchema, Knowledge, knowledgeFilterSchema, UpdateKnowledge,
  updateKnowledgeSchema
} from '@snipet/schemas';

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
