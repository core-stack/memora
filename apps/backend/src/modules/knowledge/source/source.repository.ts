import { source } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { Source } from '@memora/schemas';

export class SourceRepository extends DrizzleGenericRepository<typeof source, Source> {
  constructor() {
    super(source);
  }
}