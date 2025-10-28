import { CrudController } from '@/generics';
import { Controller } from '@nestjs/common';
import {
  createKnowledgeFolderSchema, KnowledgeFolder, knowledgeFolderFilterSchema,
  updateKnowledgeFolderSchema
} from '@snipet/schemas';

import { FolderService } from './folder.service';

@Controller('knowledge/:knowledgeSlug/folder')
export class FolderController extends CrudController<KnowledgeFolder>(
  knowledgeFolderFilterSchema,
  createKnowledgeFolderSchema,
  updateKnowledgeFolderSchema) {
  constructor(folderService: FolderService) {
    super(folderService);
  }
}
