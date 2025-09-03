import { tag } from "@/db/schema";
import { GenericController } from "@/generics";
import {
  CreateTag, createTagSchema, Tag, tagFilterSchema, UpdateTag, updateTagSchema
} from "@memora/schemas";
import { Controller } from "@nestjs/common";

import { TagService } from "./tag.service";

@Controller('tag')
export class TagController extends GenericController<
  typeof tag,
  Tag,
  CreateTag,
  UpdateTag
>  {
  constructor(tagService: TagService) {
    super(
      tagService,
      tagFilterSchema,
      createTagSchema,
      updateTagSchema
    );
  }
}
