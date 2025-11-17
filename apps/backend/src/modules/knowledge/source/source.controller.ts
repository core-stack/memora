import { SourceEntity } from '@/entities/source.entity';
import { BaseController } from '@/shared/controller';
import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { GetUploadUrlDto } from './dto/get-upload-url.dto';
import { SourceService } from './source.service';

@Controller('tenant/:tenantId/knowledge/:knowledgeSlug/source')
export class SourceController extends BaseController<SourceEntity>() {
  constructor(public service: SourceService) {
    super(service);
  }

  @Get(":id/view")
  async view(@Param("id", ParseUUIDPipe) sourceId: string) {
    return this.service.view(sourceId);
  }

  @Get(":id/download-url")
  async download(@Param("id", ParseUUIDPipe) sourceId: string) {
    return this.service.downloadUrl(sourceId);
  }

  @Post("upload-url")
  async upload(@Body() body: GetUploadUrlDto) {
    return this.service.getUploadUrl(body);
  }

  @Post(":id/retry")
  async retry(@Param("id", ParseUUIDPipe) sourceId: string) {
    return this.service.retryIndex(sourceId);
  }
}
