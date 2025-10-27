import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';

import { env } from '@/env';
import { CrudService } from '@/generics';
import { FilterOptions } from '@/generics/filter-options';
import { HttpContext } from '@/generics/http-context';
import { PublicStorageService } from '@/infra/storage/public-storage.service';
import { JobType } from '@/jobs/types';
import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GetUploadUrl, Source } from '@snipet/schemas';

import { FolderService } from '../folder/folder.service';
import { KnowledgeService } from '../knowledge.service';
import { SourceRepository } from './source.repository';
import { CreateSource, UpdateSource } from './source.schema';

@Injectable()
export class SourceService extends CrudService<Source, CreateSource, UpdateSource> {
  constructor(
    protected readonly repository: SourceRepository,
    private readonly knowledgeService: KnowledgeService,
    private readonly folderService: FolderService,
    private readonly storageService: PublicStorageService,
    @InjectQueue(JobType.INGEST) private readonly ingestQueue: Queue
  ) {
    super(repository);
  }

  override async find(opts: FilterOptions<Source>, ctx: HttpContext): Promise<Source[]> {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(ctx));
    opts.filter = opts.filter ?? {};
    opts.filter.knowledgeId = knowledgeId;
    return super.find(opts, ctx);
  }

  override async create(input: CreateSource, ctx: HttpContext) {
    if (!input.key) throw new BadRequestException("Key is required");

    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(ctx));
    input.knowledgeId = knowledgeId;
    input.indexStatus = 'PENDING';
    input.path = await this.folderService.getPathByFolderId(
      input.originalName ?? input.name!,
      input.folderId
    );

    try {
      input.key = await this.storageService.confirmTempUpload(input.key);
    } catch (error) {
      throw new BadRequestException("Invalid key");
    }

    const createdSource = await super.create(input, ctx);
    
    await this.knowledgeService.increaseFileCount(knowledgeId);
    await this.knowledgeService.increaseStorageCount(knowledgeId, createdSource.metadata.size);
    await this.ingestQueue.add(JobType.INGEST, createdSource, { jobId: createdSource.id });
    return createdSource;
  }

  async getUploadUrl(input: GetUploadUrl, ctx: HttpContext) {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(ctx));
    const key = `source/${env.TENANT_ID}/${knowledgeId}/${randomUUID()}.${input.fileName.split(".").pop()}`;
    return this.storageService.getUploadUrl(key, input.contentType, { temp: true });
  }

  async view(sourceId: string) {
    const source = (await this.repository.find({ filter: { id: sourceId } }))[0];
    if (!source) throw new BadRequestException("Source not found");
    return this.storageService.getVisualizationUrl(source.key);
  }

  async retryIndex(sourceId: string) {
    const source = (await this.repository.find({ filter: { id: sourceId } }))[0];
    if (!source) throw new BadRequestException("Source not found");
    await this.repository.update(source.id, { indexStatus: 'PENDING' });
    const failedJob = await this.ingestQueue.getJob(source.id);
    if (failedJob && await failedJob.isFailed()) {
      await failedJob.retry();
    }
    return source;
  }
}
