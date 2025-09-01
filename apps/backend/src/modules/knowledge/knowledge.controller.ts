import { CreateKnowledgeBase, createKnowledgeBaseSchema } from "@memora/schemas";
import { Body, Controller, Post } from "@nestjs/common";

import { ZodValidationPipe } from "src/pipes/zod.pipe";

import { KnowledgeService } from "./knowledge.service";

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post()
  async create(@Body(new ZodValidationPipe(createKnowledgeBaseSchema)) body: CreateKnowledgeBase) {

  }
}
