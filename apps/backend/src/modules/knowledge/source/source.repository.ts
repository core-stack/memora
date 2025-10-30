import { source } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { CreateSourceEntity, createSourceEntity, SourceEntity, UpdateSourceEntity } from './source.entity';

export class SourceRepository extends DrizzleGenericRepository<
  typeof source, SourceEntity, CreateSourceEntity, UpdateSourceEntity
> {
  constructor() {
    super(source);
  }
}