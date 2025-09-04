import { GenericController } from "@/generics";
import {
  createKnowledgeFolderSchema, KnowledgeFolder, knowledgeFolderFilterSchema, updateKnowledgeFolderSchema
} from "@memora/schemas";
import { Controller } from "@nestjs/common";

import { FolderService } from "./folder.service";

@Controller('folder')
export class FolderController extends GenericController<KnowledgeFolder> {
  constructor(folderService: FolderService) {
    super(
      folderService,
      knowledgeFolderFilterSchema,
      createKnowledgeFolderSchema,
      updateKnowledgeFolderSchema
    );
  }
}
