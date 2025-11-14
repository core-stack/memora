import { Controller } from '@nestjs/common';
import {
  createKnowledgeFolderSchema, KnowledgeFolder, knowledgeFolderFilterSchema,
  updateKnowledgeFolderSchema
} from '@snipet/schemas';

import { FolderService } from './folder.service';
import { BaseController } from '@/shared/controller';
import { FolderEntity } from './folder.entity';

@Controller('tenant/:tenantId/knowledge/:knowledgeSlug/folder')
export class FolderController extends BaseController<FolderEntity>() {
  constructor(folderService: FolderService) {
    super(folderService);
  }
}
