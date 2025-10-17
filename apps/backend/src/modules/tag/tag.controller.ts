import { CrudController } from '@/generics';
import { Controller } from '@nestjs/common';
import { createTagSchema, Tag, tagFilterSchema, updateTagSchema } from '@snipet/schemas';

import { TagService } from './tag.service';

@Controller('tag')
export class TagController extends CrudController<Tag> {
  constructor(tagService: TagService) {
    super(tagService, tagFilterSchema, createTagSchema, updateTagSchema);
  }
}
