import { CrudController } from "@/generics";
import { createTagSchema, Tag, tagFilterSchema, updateTagSchema } from "@memora/schemas";
import { Controller } from "@nestjs/common";

import { TagService } from "./tag.service";

@Controller('tag')
export class TagController extends CrudController<Tag> {
  constructor(tagService: TagService) {
    super(tagService, tagFilterSchema, createTagSchema, updateTagSchema);
  }
}
