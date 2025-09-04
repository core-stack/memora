import { GenericService } from "@/generics";
import { Source } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

import { SourceRepository } from "./source.repository";

@Injectable()
export class SourceService extends GenericService<Source> {
  constructor(repository: SourceRepository) {
    super(repository);
  }
}
