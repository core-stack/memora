import { GenericController } from "@/generics";
import { createSourceSchema, Source, sourceFilterSchema, updateSourceSchema } from "@memora/schemas";
import { Controller } from "@nestjs/common";

import { SourceService } from "./source.service";

@Controller('source')
export class SourceController extends GenericController<Source> {
  constructor(sourceService: SourceService) {
    super(
      sourceService,
      sourceFilterSchema,
      createSourceSchema,
      updateSourceSchema
    );
  }
}
