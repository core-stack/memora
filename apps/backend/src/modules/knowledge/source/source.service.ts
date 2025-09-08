import { randomUUID } from 'crypto';

import { env } from '@/env';
import { StorageService } from '@/infra/storage/storage.service';
import { TenantService } from '@/services/tenant.service';
import { GetUploadUrl, Source } from '@memora/schemas';
import { BadRequestException, Injectable } from '@nestjs/common';

import { KnowledgeService } from '../knowledge.service';
import { SourceRepository } from './source.repository';

@Injectable()
export class SourceService extends TenantService<Source> {
  constructor(
    protected readonly repository: SourceRepository,
    private readonly knowledgeService: KnowledgeService,
    private readonly storageService: StorageService
  ) {
    super(repository);
  }

  override async create(input: Partial<Source>) {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug());
    input.knowledgeId = knowledgeId;
    input.indexStatus = 'PENDING';
    return super.create(input);
  }

  async getUploadUrl(input: GetUploadUrl) {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug());
    const key = `source/${env.TENANT_ID}/${knowledgeId}/${randomUUID()}.${input.fileName.split(".").pop()}`;
    return this.storageService.getUploadUrl(key, input.contentType, { temp: true, publicAccess: false });
  }

  async view(sourceId: string) {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug());
    const source = (await this.repository.find({ filter: { id: sourceId } }))[0];
    if (!source) throw new BadRequestException("Source not found");
    const ext = source.originalName?.split(".").pop();
    const key = `source/${env.TENANT_ID}/${knowledgeId}/${randomUUID()}.${ext}`;
    return this.storageService.getVisualizationUrl(key);
  }
}
