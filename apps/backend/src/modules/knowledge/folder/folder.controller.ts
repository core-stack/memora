import { folder } from "@/db/schema";
import { GenericController } from "@/generics";
import {
  CreateKnowledgeFolder, createKnowledgeFolderSchema, KnowledgeFolder, knowledgeFolderFilterSchema,
  UpdateKnowledgeFolder, updateKnowledgeFolderSchema
} from "@memora/schemas";
import { Controller } from "@nestjs/common";

import { FolderService } from "./folder.service";

@Controller('folder')
export class FolderController extends GenericController<
  typeof folder,
  KnowledgeFolder,
  CreateKnowledgeFolder,
  UpdateKnowledgeFolder
>  {
  constructor(folderService: FolderService) {
    super(
      folderService,
      knowledgeFolderFilterSchema,
      createKnowledgeFolderSchema,
      updateKnowledgeFolderSchema
    );
  }
}
