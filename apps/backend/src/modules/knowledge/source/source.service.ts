import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';

import { env } from '@/env';
import { FilterOptions } from '@/generics/filter-options';
import { HttpContext } from '@/generics/http-context';
import { TenantService } from '@/generics/tenant.service';
import { StorageService } from '@/infra/storage/storage.service';
import { GetUploadUrl, Source } from '@memora/schemas';
import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';

import { FolderService } from '../folder/folder.service';
import { KnowledgeService } from '../knowledge.service';
import { SourceRepository } from './source.repository';

@Injectable()
export class SourceService extends TenantService<Source> {
  constructor(
    protected readonly repository: SourceRepository,
    private readonly knowledgeService: KnowledgeService,
    private readonly folderService: FolderService,
    private readonly storageService: StorageService,
    @InjectQueue("ingest") private readonly ingestQueue: Queue
  ) {
    super(repository);
  }

  override async find(opts: FilterOptions<Source>, ctx: HttpContext): Promise<Source[]> {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(ctx));
    opts.filter = opts.filter ?? {};
    opts.filter.knowledgeId = knowledgeId;
    return super.find(opts, ctx);
  }

  override async create(input: Partial<Source>, ctx: HttpContext) {
    if (!input.key) throw new BadRequestException("Key is required");

    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(ctx));
    input.knowledgeId = knowledgeId;
    input.indexStatus = 'PENDING';
    // generate path
    if (!)
    const folder = await this.folderService.findByID(input.folderId);


    try {
      input.key = await this.storageService.confirmTempUpload(input.key);
    } catch (error) {
      throw new BadRequestException("Invalid key");
    }

    const cratedSource = await super.create(input, ctx);
    this.ingestQueue.add("ingest", cratedSource);
    return cratedSource;
  }

  async getUploadUrl(input: GetUploadUrl, ctx: HttpContext) {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(ctx));
    const key = `source/${env.TENANT_ID}/${knowledgeId}/${randomUUID()}.${input.fileName.split(".").pop()}`;
    return this.storageService.getUploadUrl(key, input.contentType, { temp: true, publicAccess: false });
  }

  async view(sourceId: string) {
    const source = (await this.repository.find({ filter: { id: sourceId } }))[0];
    if (!source) throw new BadRequestException("Source not found");
    return this.storageService.getVisualizationUrl(source.key);
  }
}
