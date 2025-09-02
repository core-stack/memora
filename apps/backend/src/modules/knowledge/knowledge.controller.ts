import { createKnowledgeBaseSchema, updateKnowledgeBaseSchema } from "@memora/schemas";
import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";

import { BodyZod } from "src/decorators/body-zod";

import { KnowledgeService } from "./knowledge.service";

import type { CreateKnowledgeBase, UpdateKnowledgeBase } from '@memora/schemas';
@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get()
  async getAll() {
    return this.knowledgeService.getAll();
  }

  @Post()
  async create(@BodyZod(createKnowledgeBaseSchema) body: CreateKnowledgeBase) {
    this.knowledgeService.create(body);
  }

  @Put()
  async update(@BodyZod(updateKnowledgeBaseSchema) body: UpdateKnowledgeBase) {
    this.knowledgeService.update(body);
  }

  @Delete()
  async delete(@Body('id') id: string) {
    this.knowledgeService.delete(id);
  }
}
