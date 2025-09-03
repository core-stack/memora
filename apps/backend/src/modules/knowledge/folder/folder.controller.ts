

import { Controller } from '@nestjs/common';

import { FolderService } from './folder.service';

import type {
  CreateKnowledgeFolder, UpdateKnowledgeFolder
} from "@memora/schemas";
@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

}
