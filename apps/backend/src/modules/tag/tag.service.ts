import { tag } from "@/db/schema";
import { env } from "@/env";
import { GenericService } from "@/generics";
import { Tag, UpdateTag } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

import { TagRepository } from "./tag.repository";
import { CreateTag } from "./tag.schema";

@Injectable()
export class TagService extends GenericService<
  typeof tag,
  Tag,
  CreateTag,
  UpdateTag
> {
  constructor(repository: TagRepository) {
    super(repository);
  }

  protected override beforeCreate = (data: CreateTag): CreateTag => {
    data.tenantId = env.TENANT_ID;
    return data;
  }
}
