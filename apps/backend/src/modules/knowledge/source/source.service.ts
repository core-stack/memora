import { TenantService } from '@/services/tenant.service';
import { Source } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

import { KnowledgeService } from '../knowledge.service';
import { SourceRepository } from './source.repository';

@Injectable()
export class SourceService extends TenantService<Source> {
  constructor(
    protected readonly repository: SourceRepository,
    private readonly knowledgeService: KnowledgeService
  ) {
    super(repository);
  }

  override async create(input: Partial<Source>) {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug());
    input.knowledgeId = knowledgeId;
    return super.create(input);
  }
}
