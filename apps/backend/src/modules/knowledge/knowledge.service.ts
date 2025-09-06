import { TenantService } from '@/services/tenant.service';
import { Knowledge } from '@memora/schemas';
import { BadRequestException, Injectable } from '@nestjs/common';

import { KnowledgeRepository } from './knowledge.repository';

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

  async loadFromSlug(): Promise<Knowledge> {
    const knowledgeSlug = this.ctxProvider.context.params.shouldGetString("knowledgeSlug");
    const knowledge = await this.findBySlug(knowledgeSlug);
    if (!knowledge) throw new BadRequestException("Knowledge not found");
    return knowledge;
  }
}
