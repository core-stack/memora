import { BaseController } from '@/shared/controller';
import { Controller } from '@nestjs/common';

import { FolderEntity } from '../../../entities/folder.entity';
import { FolderService } from './folder.service';

@Controller('tenant/:tenantId/knowledge/:knowledgeSlug/folder')
export class FolderController extends BaseController(FolderEntity) {
  constructor(folderService: FolderService) {
    super(folderService);
  }
}
