import { Queue } from 'bullmq';
import { randomUUID } from 'crypto';
import { EntityManager } from 'typeorm';

import { IndexStatus, SourceEntity } from '@/entities/source.entity';
import { PrivateStorageService } from '@/infra/storage/private-storage.service';
import { JobType } from '@/jobs/types';
import { Service } from '@/shared/service';
import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { FolderService } from '../folder/folder.service';
import { KnowledgeService } from '../knowledge.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { GetUploadUrlDto } from './dto/get-upload-url.dto';

@Injectable()
export class SourceService extends Service<SourceEntity> {
  logger = new Logger(SourceService.name);
  entity = SourceEntity;

  @Inject() private readonly knowledgeService: KnowledgeService;
  @Inject() private readonly folderService: FolderService;
  @Inject() private readonly storageService: PrivateStorageService;
  @InjectQueue(JobType.INGEST) private readonly ingestQueue: Queue;

  override async create(input: CreateSourceDto, manager?: EntityManager) {
    const source = await super.create(new SourceEntity({
      ...input,
      indexStatus: IndexStatus.PENDING,
      path: await this.folderService.getPathByFolderId(
        input.originalName ?? input.name!,
        input.folderId,
        manager
      ),
      key: await this.storageService.confirmTempUpload(input.key),
    }), manager);

    await this.knowledgeService.increaseFileCount(input.knowledgeId, 1, manager);
    await this.knowledgeService.increaseStorageCount(input.knowledgeId, source.metadata.size, manager);
    await this.ingestQueue.add(JobType.INGEST, source, { jobId: source.id });
    return source;
  }

  async getUploadUrl(input: GetUploadUrlDto) {
    const tenantId = this.context.params.shouldGetString("tenantId");
    const knowledgeId = this.context.params.shouldGetString("knowledgeId");
    const ext = input.fileName.split(".").pop();
    const key = `source/${tenantId}/${knowledgeId}/${randomUUID()}.${ext}`;
    return this.storageService.getUploadUrl(key, input.contentType, { temp: true });
  }

  async downloadUrl(sourceId: string, manager?: EntityManager) {
    const source = await this.repository(manager).findOneOrFail({ where: { id: sourceId } });
    if (!source) throw new NotFoundException("Source not found");
    return {
      url: await this.storageService.getPreSignedDownloadUrl(source.key),
      key: source.key
    };
  }

  async view(sourceId: string, manager?: EntityManager) {
    const source = await this.repository(manager).findOneOrFail({ where: { id: sourceId } });
    if (!source) throw new NotFoundException("Source not found");
    return this.storageService.getVisualizationUrl(source.key);
  }

  async retryIndex(sourceId: string, manager?: EntityManager) {
    const source = await this.repository(manager).findOneOrFail({ where: { id: sourceId } });
    if (!source) throw new NotFoundException("Source not found");
    await this.repository(manager).update(source.id, { indexStatus: IndexStatus.PENDING });
    const failedJob = await this.ingestQueue.getJob(source.id);
    if (failedJob && await failedJob.isFailed()) {
      await failedJob.retry();
    } else {
      await this.ingestQueue.add(JobType.INGEST, source, { jobId: source.id });
    }
    return source;
  }
}
