import { GenericService } from "@/generics";
import { KnowledgeFolder } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

import { FolderRepository } from "./folder.repository";

@Injectable()
export class FolderService extends GenericService<KnowledgeFolder> {
  constructor(repository: FolderRepository) {
    super(repository);
  }
}
