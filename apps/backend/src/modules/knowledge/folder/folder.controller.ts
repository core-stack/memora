import { createKnowledgeFolderSchema, updateKnowledgeFolderSchema } from "@memora/schemas";
import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";

import { BodyZod } from "src/decorators/body-zod";

import { FolderService } from "./folder.service";

import type {
  CreateKnowledgeFolder, UpdateKnowledgeFolder
} from "@memora/schemas";
@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Get()
  async getAll() {
    return this.folderService.getAll();
  }

  @Post()
  async create(@BodyZod(createKnowledgeFolderSchema) body: CreateKnowledgeFolder) {
    this.folderService.create(body);
  }

  @Put()
  async update(@BodyZod(updateKnowledgeFolderSchema) body: UpdateKnowledgeFolder) {
    this.folderService.update(body);
  }

  @Delete()
  async delete(@Body('id') id: string) {
    this.folderService.delete(id);
  }
}
