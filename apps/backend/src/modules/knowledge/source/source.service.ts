import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';
import { EntityManager } from 'typeorm';

import { PrivateStorageService } from '@/infra/storage/private-storage.service';
import { JobType } from '@/jobs/types';
import { IndexStatus } from '@/shared/enums';
import { FilterOptions } from '@/shared/filter-options';
import { Service } from '@/shared/service';
import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { FolderService } from '../folder/folder.service';
import { KnowledgeService } from '../knowledge.service';
import { SourceEntity } from './source.entity';

@Injectable()
export class SourceService extends Service<SourceEntity> {
  logger = new Logger(SourceService.name);
  entity = SourceEntity;

  @Inject() private readonly knowledgeService: KnowledgeService;
  @Inject() private readonly folderService: FolderService;
  @Inject() private readonly storageService: PrivateStorageService;
  @InjectQueue(JobType.INGEST) private readonly ingestQueue: Queue;

  override async find(filterOpts: FilterOptions<SourceEntity>, manager?: EntityManager): Promise<SourceEntity[]> {
    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug();
    filterOpts.where = filterOpts.where ?? {};
    filterOpts.where.knowledgeId = knowledgeId;
    return super.find(filterOpts, manager);
  }

  override async create(input: SourceEntity, manager?: EntityManager) {
    if (!input.key) throw new BadRequestException("Key is required");

    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug();
    input.knowledgeId = knowledgeId;
    input.indexStatus = IndexStatus.PENDING;
    input.path = await this.folderService.getPathByFolderId(
      input.originalName ?? input.name!,
      input.folderId,
      manager
    );

    try {
      input.key = await this.storageService.confirmTempUpload(input.key);
    } catch (error) {
      throw new BadRequestException("Invalid key");
    }

    const createdSource = await super.create(input, manager);

    await this.knowledgeService.increaseFileCount(knowledgeId);
    await this.knowledgeService.increaseStorageCount(knowledgeId, createdSource.metadata.size);
    await this.ingestQueue.add(JobType.INGEST, createdSource, { jobId: createdSource.id });
    return createdSource;
  }

  async getUploadUrl(input: GetUploadUrl, manager?: EntityManager) {
    const { id: knowledgeId } = await this.knowledgeService.loadFromSlug();
    const ext = input.fileName.split(".").pop();
    const key = `source/${opts?.http?.params.shouldGetString("tenantId")}/${knowledgeId}/${randomUUID()}.${ext}`;
    return this.storageService.getUploadUrl(key, input.contentType, { temp: true });
  }

  async downloadUrl(sourceId: string, manager?: EntityManager) {
    const source = await this.repository.findByID(sourceId, { tx: opts?.tx });
    if (!source) throw new NotFoundException("Source not found");
    return {
      url: await this.storageService.getPreSignedDownloadUrl(source.key),
      key: source.key
    };
  }

  async view(sourceId: string, manager?: EntityManager) {
    const source = (await this.repository.find({ filter: { id: sourceId } }, { tx: opts?.tx }))[0];
    if (!source) throw new NotFoundException("Source not found");
    return this.storageService.getVisualizationUrl(source.key);
  }

  async retryIndex(sourceId: string, manager?: EntityManager) {
    const source = (await this.repository.find({ filter: { id: sourceId } }, { tx: opts?.tx }))[0];
    if (!source) throw new NotFoundException("Source not found");
    await this.repository.update(source.id, { indexStatus: 'PENDING' }, { tx: opts?.tx });
    const failedJob = await this.ingestQueue.getJob(source.id);
    if (failedJob && await failedJob.isFailed()) {
      await failedJob.retry();
    } else {
      await this.ingestQueue.add(JobType.INGEST, source, { jobId: source.id });
    }
    return source;
  }
}
