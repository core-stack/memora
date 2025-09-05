import { CrudController } from "@/generics";
import {
  createKnowledgeSchema, Knowledge, knowledgeFilterSchema, updateKnowledgeSchema
} from "@memora/schemas";
import { Controller } from "@nestjs/common";

import { KnowledgeService } from "./knowledge.service";

@Controller('knowledge')
export class KnowledgeController extends CrudController<Knowledge> {
  constructor(knowledgeService: KnowledgeService) {
    super(
      knowledgeService,
      knowledgeFilterSchema,
      createKnowledgeSchema,
      updateKnowledgeSchema
    );
  }
}
