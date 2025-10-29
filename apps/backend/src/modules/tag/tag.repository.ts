import { tag } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { CreateTagEntity, TagEntity, UpdateTagEntity } from './tag.entity';

export class TagRepository extends DrizzleGenericRepository<
  typeof tag, TagEntity, CreateTagEntity, UpdateTagEntity
> {
  constructor() {
    super(tag);
  }
}