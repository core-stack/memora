import { folder } from "@/db/schema";
import { GenericService } from "@/generics";
import { CreateKnowledgeFolder, KnowledgeFolder, UpdateKnowledgeFolder } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

import { FolderRepository } from "./folder.repository";

@Injectable()
export class FolderService extends GenericService<
  typeof folder,
  KnowledgeFolder,
  CreateKnowledgeFolder,
  UpdateKnowledgeFolder
> {
  constructor(repository: FolderRepository) {
    super(repository);
  }
}
