import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';

import { env } from '@/env';
import { CrudService } from '@/generics';
import { FilterOptions } from '@/generics/filter-options';
import { HttpContext } from '@/generics/http-context';
import { PublicStorageService } from '@/infra/storage/public-storage.service';
import { JobType } from '@/jobs/types';
import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateSource, GetUploadUrl, Source, UpdateSource } from '@snipet/schemas';

import { FolderService } from '../folder/folder.service';
import { KnowledgeService } from '../knowledge.service';
import { SourceRepository } from './source.repository';
import { CreateSourceEntity, SourceEntity, UpdateSourceEntity } from './source.entity';
import { ServiceOptions } from '@/generics/service.interface';
import { GenericTenantService } from '@/generics/tenant.service';

@Injectable()
export class SourceService extends GenericTenantService<
  Source, CreateSource, UpdateSource,
  SourceEntity, CreateSourceEntity, UpdateSourceEntity
> {
  logger = new Logger(SourceService.name);
  constructor(
    protected readonly repository: SourceRepository,
    private readonly knowledgeService: KnowledgeService,
    private readonly folderService: FolderService,
    private readonly storageService: PublicStorageService,
    @InjectQueue(JobType.INGEST) private readonly ingestQueue: Queue
  ) {
    super(repository);
  }

  override async find(filterOpts: FilterOptions<Source>, opts?: ServiceOptions): Promise<Source[]> {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(opts?.http));
    filterOpts.filter = filterOpts.filter ?? {};
    filterOpts.filter.knowledgeId = knowledgeId;
    return super.find(filterOpts, opts);
  }

  override async create(input: CreateSourceEntity, opts?: ServiceOptions) {
    if (!input.key) throw new BadRequestException("Key is required");

    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(opts?.http));
    input.knowledgeId = knowledgeId;
    input.indexStatus = 'PENDING';
    input.path = await this.folderService.getPathByFolderId(
      input.originalName ?? input.name!,
      input.folderId,
      opts
    );

    try {
      input.key = await this.storageService.confirmTempUpload(input.key);
    } catch (error) {
      throw new BadRequestException("Invalid key");
    }

    const createdSource = await super.create(input, opts);

    await this.knowledgeService.increaseFileCount(knowledgeId);
    await this.knowledgeService.increaseStorageCount(knowledgeId, createdSource.metadata.size);
    await this.ingestQueue.add(JobType.INGEST, createdSource, { jobId: createdSource.id });
    return createdSource;
  }

  async getUploadUrl(input: GetUploadUrl, opts?: ServiceOptions) {
    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(opts?.http));
    const ext = input.fileName.split(".").pop();
    const key = `source/${this.getTenantId(opts)}/${knowledgeId}/${randomUUID()}.${ext}`;
    return this.storageService.getUploadUrl(key, input.contentType, { temp: true });
  }

  async view(sourceId: string, opts?: ServiceOptions) {
    const source = (await this.repository.find({ filter: { id: sourceId } }, { tx: opts?.tx }))[0];
    if (!source) throw new BadRequestException("Source not found");
    return this.storageService.getVisualizationUrl(source.key);
  }

  async retryIndex(sourceId: string, opts?: ServiceOptions) {
    const source = (await this.repository.find({ filter: { id: sourceId } }, { tx: opts?.tx }))[0];
    if (!source) throw new BadRequestException("Source not found");
    await this.repository.update(source.id, { indexStatus: 'PENDING' }, { tx: opts?.tx });
    const failedJob = await this.ingestQueue.getJob(source.id);
    if (failedJob && await failedJob.isFailed()) {
      await failedJob.retry();
    }
    return source;
  }
}
