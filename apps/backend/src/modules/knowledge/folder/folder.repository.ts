import { folder } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { CreateFolderEntity, FolderEntity, UpdateFolderEntity } from './folder.entity';

export class FolderRepository extends DrizzleGenericRepository<
  typeof folder, FolderEntity, CreateFolderEntity, UpdateFolderEntity
> {
  constructor() {
    super(folder);
  }
}