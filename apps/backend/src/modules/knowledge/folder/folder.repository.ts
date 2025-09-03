import { folder } from "@/db/schema";
import { GenericRepository } from "@/generics";
import { CreateKnowledgeFolder, KnowledgeFolder, UpdateKnowledgeFolder } from "@memora/schemas";

export class FolderRepository extends GenericRepository<
  typeof folder,
  KnowledgeFolder,
  CreateKnowledgeFolder,
  UpdateKnowledgeFolder
> {
  constructor() {
    super(folder);
  }
}