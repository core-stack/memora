import { CrudController } from '@/generics';
import {
  createSourceSchema, Source, sourceFilterSchema, updateSourceSchema
} from '@memora/schemas';
import { Controller } from '@nestjs/common';

import { SourceService } from './source.service';

@Controller('knowledge/:knowledgeSlug/source')
export class SourceController extends CrudController<Source> {
  constructor(sourceService: SourceService) {
    super(
      sourceService,
      sourceFilterSchema,
      createSourceSchema,
      updateSourceSchema
    );
  }
}
