import { env } from "@/env";
import { HttpContext } from "@/generics/http-context";
import { TenantService } from "@/generics/tenant.service";
import { StorageService } from "@/infra/storage/storage.service";
import { GetUploadUrl, Source } from "@memora/schemas";
import { InjectQueue } from "@nestjs/bullmq";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { randomUUID } from "crypto";

import { KnowledgeService } from "../knowledge.service";

import { SourceRepository } from "./source.repository";

@Injectable()
export class SourceService extends TenantService<Source> {
  constructor(
    protected readonly repository: SourceRepository,
    private readonly knowledgeService: KnowledgeService,
    private readonly storageService: StorageService,
    @InjectQueue("ingest") private readonly ingestQueue: Queue
  ) {
    super(repository);
  }

  override async create(input: Partial<Source>, ctx: HttpContext) {
    if (!input.key) throw new BadRequestException("Key is required");

    const { id: knowledgeId } = await (this.knowledgeService.loadFromSlug(ctx));
    input.knowledgeId = knowledgeId;
    input.indexStatus = 'PENDING';

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

  async view(sourceId: string, ctx: HttpContext) {
    const source = (await this.repository.find({ filter: { id: sourceId } }))[0];
    if (!source) throw new BadRequestException("Source not found");
    return this.storageService.getVisualizationUrl(source.key);
  }
}
