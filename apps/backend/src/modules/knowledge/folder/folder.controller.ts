import { CrudController } from '@/generics';
import {
  createKnowledgeFolderSchema, KnowledgeFolder, knowledgeFolderFilterSchema,
  updateKnowledgeFolderSchema
} from '@memora/schemas';
import { Controller } from '@nestjs/common';

import { FolderService } from './folder.service';

@Controller('knowledge/:knowledgeSlug/folder')
export class FolderController extends CrudController<KnowledgeFolder> {
  constructor(folderService: FolderService) {
    super(
      folderService,
      knowledgeFolderFilterSchema,
      createKnowledgeFolderSchema,
      updateKnowledgeFolderSchema
    );
  }
}
