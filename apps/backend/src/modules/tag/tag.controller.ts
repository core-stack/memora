import { GenericController } from "@/generics";
import { createTagSchema, Tag, tagFilterSchema, updateTagSchema } from "@memora/schemas";
import { Controller } from "@nestjs/common";

import { TagService } from "./tag.service";

@Controller('tag')
export class TagController extends GenericController<Tag> {
  constructor(tagService: TagService) {
    super(tagService, tagFilterSchema, createTagSchema, updateTagSchema);
  }
}
