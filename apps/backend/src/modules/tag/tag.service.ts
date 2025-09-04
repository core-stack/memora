import { env } from "@/env";
import { GenericService } from "@/generics";
import { BeforeCreate } from "@/generics/hooks.decorators";
import { Tag } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

import { TagRepository } from "./tag.repository";

@Injectable()
export class TagService extends GenericService<Tag> {
  constructor(repository: TagRepository) {
    super(repository);
  }

  @BeforeCreate<Tag>()
  protected beforeCreate(data: Partial<Tag>): Partial<Tag> {
    data.tenantId = env.TENANT_ID;
    return data;
  }
}
