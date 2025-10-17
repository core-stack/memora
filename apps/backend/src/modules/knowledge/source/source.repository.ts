import { source } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { Source } from '@snipet/schemas';

export class SourceRepository extends DrizzleGenericRepository<typeof source, Source> {
  constructor() {
    super(source);
  }
}