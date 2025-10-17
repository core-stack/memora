import { folder } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { KnowledgeFolder } from '@snipet/schemas';

export class FolderRepository extends DrizzleGenericRepository<typeof folder, KnowledgeFolder> {
  constructor() {
    super(folder);
  }
}