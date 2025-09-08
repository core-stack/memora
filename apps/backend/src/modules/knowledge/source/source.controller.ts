import { CrudController } from "@/generics";
import { ZodBody } from "@/shared/decorators/zod-body";
import { ZodParam } from "@/shared/decorators/zod-param";
import {
  createSourceSchema, getUploadUrlSchema, idSchema, Source, sourceFilterSchema, updateSourceSchema
} from "@memora/schemas";
import { Controller, Get, Post, Req } from "@nestjs/common";

import { SourceService } from "./source.service";

import type { GetUploadUrl } from '@memora/schemas';
import type { Request } from 'express';
@Controller('knowledge/:knowledgeSlug/source')
export class SourceController extends CrudController<Source> {
  constructor(protected readonly service: SourceService) {
    super(
      service,
      sourceFilterSchema,
      createSourceSchema,
      updateSourceSchema
    );
  }

  @Get(":source_id/view")
  async view(@Req() req: Request, @ZodParam("source_id", idSchema) sourceId: string) {
    return this.service.view(sourceId, this.loadContext(req));
  }

  @Post("upload-url")
  async upload(@Req() req: Request, @ZodBody(getUploadUrlSchema) body: GetUploadUrl) {
    return this.service.getUploadUrl(body, this.loadContext(req));
  }
}
