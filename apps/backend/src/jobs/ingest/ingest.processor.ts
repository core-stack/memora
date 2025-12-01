import { Job } from "bullmq";
import streamToBlob from "stream-to-blob";

import { IndexStatus, SourceEntity } from "@/entities/source.entity";
import { PrivateStorageService } from "@/infra/storage/private-storage.service";
import { SourceVectorStoreService } from "@/infra/vector/source-vector-store.service";
import { SourceService } from "@/modules/knowledge/source/source.service";
import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { forwardRef, Inject, Logger } from "@nestjs/common";

import { JobType } from "../types";
import { ProcessorManager } from "./processor-manager";
import { KnowledgeService } from "@/modules/knowledge/knowledge.service";
import { LLMType } from "@/entities";

@Processor(JobType.INGEST, { concurrency: 1 })
export class IngestProcessor extends WorkerHost {
  private logger = new Logger(IngestProcessor.name);
  @Inject() private readonly processor!: ProcessorManager;
  @Inject() private readonly vectorStore!: SourceVectorStoreService;
  @Inject() private readonly storage!: PrivateStorageService;
  @Inject() private readonly knowledgeService!: KnowledgeService;
  @Inject(forwardRef(() => SourceService)) private readonly sourceService: SourceService;

  async process(job: Job<SourceEntity>): Promise<any> {
    const source = job.data;
    const knowledge = await this.knowledgeService.findByID(
      source.knowledgeId,
      { relations: [ "knowledgeLLMs.llm" ] }
    );
    if (!knowledge) throw new Error("Knowledge not found");

    const llm = knowledge.knowledgeLLMs?.find(llm => llm.default && llm.llm?.type === LLMType.EMBEDDING);
    if (!llm) throw new Error("LLM not found");

    const obj = await this.storage.getObject(source.key);
    if (!obj) throw new Error("File not found");
    const fragments = await this.processor.process(source, await streamToBlob(obj));

    await this.vectorStore.addFragments(llm?.llmId, fragments);
  }

  @OnWorkerEvent("active")
  async onStart(job: Job<SourceEntity>) {
    this.logger.log("ingest started");
    const source = job.data;
    await this.sourceService.update(source.id, { indexStatus: IndexStatus.INDEXING });
  }

  @OnWorkerEvent("completed")
  async onCompleted(job: Job<SourceEntity>) {
    this.logger.log("ingest completed");
    const source = job.data;
    await this.sourceService.update(source.id, { indexStatus: IndexStatus.INDEXED });
  }

  @OnWorkerEvent("failed")
  async onFailed(job: Job<SourceEntity>, error: Error) {
    this.logger.log(error);

    const source = job.data;
    await this.sourceService.update(source.id, { indexStatus: IndexStatus.ERROR, indexError: error.message });
  }
}
