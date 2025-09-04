import { env } from "@/env";
import { GenericService } from "@/generics";
import { BeforeCreate } from "@/generics/hooks.decorators";
import { Knowledge } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

import { KnowledgeRepository } from "./knowledge.repository";

@Injectable()
export class KnowledgeService extends GenericService<Knowledge> {
  constructor(protected readonly repository: KnowledgeRepository) {
    super(repository);
  }


  @BeforeCreate<Knowledge>()
  protected beforeCreate(data: Partial<Knowledge>): Partial<Knowledge> {
    data.tenantId = env.TENANT_ID;
    return data;
  }
}
