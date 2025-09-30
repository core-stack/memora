import { CrudController } from '@/generics';
import {
  createKnowledgeSchema, Knowledge, knowledgeFilterSchema, updateKnowledgeSchema
} from '@memora/schemas';
import { Controller } from '@nestjs/common';

import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
export class KnowledgeController extends CrudController<Knowledge> {
  constructor(protected readonly service: KnowledgeService) {
    super(
      service,
      knowledgeFilterSchema,
      createKnowledgeSchema,
      updateKnowledgeSchema
    );
  }
}
