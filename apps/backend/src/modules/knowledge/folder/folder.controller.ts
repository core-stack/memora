import { BaseController } from '@/shared/controller';
import { Controller } from '@/shared/controller/decorators';

import { FolderEntity } from '../../../entities/folder.entity';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { FolderService } from './folder.service';

@Controller('tenant/:tenantId/knowledge/:knowledgeSlug/folder')
export class FolderController extends BaseController({ 
  entity: FolderEntity,
  createDto: CreateFolderDto,
  updateDto: UpdateFolderDto
}) {
  constructor(folderService: FolderService) {
    super(folderService);
  }
}
