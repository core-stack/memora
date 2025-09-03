import { tag } from "@/db/schema";
import { GenericRepository } from "@/generics";
import { Tag, UpdateTag } from "@memora/schemas";

import { CreateTag } from "./tag.schema";

export class TagRepository extends GenericRepository<
  typeof tag,
  Tag,
  CreateTag,
  UpdateTag
> {
  constructor() {
    super(tag);
  }
}