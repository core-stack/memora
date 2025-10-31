import { CrudController } from '@/generics';
import { Controller } from '@nestjs/common';
import {
  CreateKnowledge, createKnowledgeSchema, Knowledge, knowledgeFilterSchema, UpdateKnowledge,
  updateKnowledgeSchema
} from '@snipet/schemas';

import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
export class KnowledgeController extends CrudController<Knowledge, CreateKnowledge, UpdateKnowledge>(
  { filterSchema: knowledgeFilterSchema, createDtoSchema: createKnowledgeSchema, updateDtoSchema: updateKnowledgeSchema }
) {

  constructor(service: KnowledgeService) {
    super(service);
  }
}
