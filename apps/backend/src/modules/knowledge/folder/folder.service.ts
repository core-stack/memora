

import { FilterOptions } from '@/generics/filter-options';
import { HttpContext } from '@/generics/http-context';
import { TenantService } from '@/generics/tenant.service';
import { KnowledgeFolder } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

import { KnowledgeService } from '../knowledge.service';
import { FolderRepository } from './folder.repository';

@Injectable()
export class FolderService extends TenantService<KnowledgeFolder> {
  constructor(
    protected readonly repository: FolderRepository,
    private readonly knowledgeService: KnowledgeService
  ) {
    super(repository);
  }

  override async find(opts: FilterOptions<KnowledgeFolder>, ctx: HttpContext): Promise<KnowledgeFolder[]> {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(ctx));
    opts.filter = opts.filter ?? {};
    opts.filter.knowledgeId = knowledgeId;
    return super.find(opts, ctx);
  }

  override async create(input: Partial<KnowledgeFolder>, ctx: HttpContext): Promise<KnowledgeFolder> {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(ctx));
    const parentId = ctx.query.getString("parentId");

    if (parentId) input.parentId = parentId;
    input.knowledgeId = knowledgeId;
    return super.create(input, ctx);
  }
}
