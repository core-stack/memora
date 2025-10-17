import { env } from '@/env';
import { CrudService } from '@/generics';
import { HttpContext } from '@/generics/http-context';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateKnowledge, Knowledge, UpdateKnowledge } from '@snipet/schemas';

import { KnowledgeRepository } from './knowledge.repository';

@Injectable()
export class KnowledgeService extends CrudService<Knowledge, CreateKnowledge, UpdateKnowledge> {
  constructor(protected readonly repository: KnowledgeRepository) {
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

  override create(input: CreateKnowledge): Promise<Knowledge> {
    input.tags = input.tags?.filter(Boolean);
    return this.repository.create({
      ...input,
      tenantId: env.TENANT_ID
    });
  }

  override update(id: string, input: UpdateKnowledge): Promise<void> {
    input.tags = input.tags?.filter(Boolean);
    return this.repository.update(id, {
      ...input,
      tenantId: env.TENANT_ID
    });
  }
}
