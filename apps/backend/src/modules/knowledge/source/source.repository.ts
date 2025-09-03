import { source } from "@/db/schema";
import { GenericRepository } from "@/generics";
import { CreateSource, Source, UpdateSource } from "@memora/schemas";

export class SourceRepository extends GenericRepository<
  typeof source,
  Source,
  CreateSource,
  UpdateSource
> {
  constructor() {
    super(source);
  }
}