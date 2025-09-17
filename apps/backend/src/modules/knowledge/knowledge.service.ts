import { HttpContext } from "@/generics/http-context";
import { TenantService } from "@/generics/tenant.service";
import { Knowledge } from "@memora/schemas";
import { BadRequestException, Injectable } from "@nestjs/common";

import { KnowledgeRepository } from "./knowledge.repository";

@Injectable()
export class KnowledgeService extends TenantService<Knowledge> {
  constructor(
    protected readonly repository: KnowledgeRepository,
  ) {
    super(repository);
  }

  async findBySlug(slug: string): Promise<Knowledge | null> {
    return this.repository.findBySlug(slug);
  }

  async loadFromSlug(context: HttpContext): Promise<Knowledge> {
    const knowledgeSlug = context.params.shouldGetString("knowledgeSlug");
    const knowledge = await this.findBySlug(knowledgeSlug);
    if (!knowledge) throw new BadRequestException("Knowledge not found");
    return knowledge;
  }
}
