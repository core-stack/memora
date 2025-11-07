import { CrudController } from '@/generics';
import { Controller } from '@nestjs/common';
import { createTagSchema, Tag, tagFilterSchema, updateTagSchema } from '@snipet/schemas';

import { TagService } from './tag.service';

@Controller('tenant/:tenantId/tag')
export class TagController extends CrudController<Tag>(
  { filterSchema: tagFilterSchema, createDtoSchema: createTagSchema, updateDtoSchema: updateTagSchema}
) {
  constructor(service: TagService) {
    super(service);
  }
}
