import { CrudController } from '@/generics';
import { TenantGuard } from '@/guards/tenant.guard';
import { Controller, UseGuards } from '@nestjs/common';
import {
  CreateKnowledge, createKnowledgeSchema, Knowledge, knowledgeFilterSchema, UpdateKnowledge,
  updateKnowledgeSchema
} from '@snipet/schemas';

import { KnowledgeService } from './knowledge.service';

@UseGuards(TenantGuard)
@Controller('tenant/:tenantId/knowledge')
export class KnowledgeController extends CrudController<Knowledge, CreateKnowledge, UpdateKnowledge>(
  { filterSchema: knowledgeFilterSchema, createDtoSchema: createKnowledgeSchema, updateDtoSchema: updateKnowledgeSchema }
) {

  constructor(service: KnowledgeService) {
    super(service);
  }
}
