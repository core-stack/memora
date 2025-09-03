import { knowledge } from "@/db/schema";
import { GenericController } from "@/generics";
import {
  CreateKnowledge, createKnowledgeSchema, Knowledge, knowledgeFilterSchema, UpdateKnowledge,
  updateKnowledgeSchema
} from "@memora/schemas";
import { Controller } from "@nestjs/common";

import { KnowledgeService } from "./knowledge.service";

@Controller('knowledge')
export class KnowledgeController extends GenericController<
  typeof knowledge,
  Knowledge,
  CreateKnowledge,
  UpdateKnowledge
> {
  constructor(knowledgeService: KnowledgeService) {
    super(
      knowledgeService,
      knowledgeFilterSchema,
      createKnowledgeSchema,
      updateKnowledgeSchema
    );
  }
}
