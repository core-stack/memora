import { source } from "@/db/schema";
import { GenericController } from "@/generics";
import {
  CreateSource, createSourceSchema, Source, sourceFilterSchema, UpdateSource, updateSourceSchema
} from "@memora/schemas";
import { Controller } from "@nestjs/common";

import { SourceService } from "./source.service";

@Controller('source')
export class SourceController extends GenericController<
  typeof source,
  Source,
  CreateSource,
  UpdateSource
>  {
  constructor(sourceService: SourceService) {
    super(
      sourceService,
      sourceFilterSchema,
      createSourceSchema,
      updateSourceSchema
    );
  }
}
