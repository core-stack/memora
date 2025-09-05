import { TenantService } from "@/services/tenant.service";
import { Knowledge } from "@memora/schemas";
import { Injectable } from "@nestjs/common";

import { KnowledgeRepository } from "./knowledge.repository";

@Injectable()
export class KnowledgeService extends TenantService<Knowledge> {
  constructor(protected readonly repository: KnowledgeRepository) {
    super(repository);
  }
}
