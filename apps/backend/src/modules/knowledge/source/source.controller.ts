import { CrudController } from '@/generics';
import { ZodBody } from '@/shared/decorators/zod-body';
import { ZodParam } from '@/shared/decorators/zod-param';
import { Controller, Get, Post, Req } from '@nestjs/common';
import {
  createSourceSchema, getUploadUrlSchema, idSchema, Source, sourceFilterSchema, updateSourceSchema
} from '@snipet/schemas';

import { SourceService } from './source.service';

import type { GetUploadUrl } from '@snipet/schemas';
import type { Request } from 'express';

@Controller('tenant/:tenantId/knowledge/:knowledgeSlug/source')
export class SourceController extends CrudController<Source>(
  {
    filterSchema: sourceFilterSchema,
    createDtoSchema: createSourceSchema,
    updateDtoSchema: updateSourceSchema
  },
) {
  constructor(public service: SourceService) {
    super(service);
  }

  @Get(":source_id/view")
  async view(@Req() req: Request, @ZodParam("source_id", idSchema) sourceId: string) {
    return this.service.view(sourceId, { http: this.loadContext(req) });
  }

  @Get(":source_id/download-url")
  async download(@Req() req: Request, @ZodParam("source_id", idSchema) sourceId: string) {
    return this.service.downloadUrl(sourceId, { http: this.loadContext(req) });
  }

  @Post("upload-url")
  async upload(@Req() req: Request, @ZodBody(getUploadUrlSchema) body: GetUploadUrl) {
    return this.service.getUploadUrl(body, { http: this.loadContext(req) });
  }

  @Post(":source_id/retry")
  async retry(@Req() req: Request, @ZodParam("source_id", idSchema) sourceId: string) {
    return this.service.retryIndex(sourceId, { http: this.loadContext(req) });
  }
}
