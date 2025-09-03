import { source } from "@/db/schema";
import { GenericService } from "@/generics";
import { CreateSource, Source, UpdateSource } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

import { SourceRepository } from "./source.repository";

@Injectable()
export class SourceService extends GenericService<
  typeof source,
  Source,
  CreateSource,
  UpdateSource
> {
  constructor(repository: SourceRepository) {
    super(repository);
  }
}
