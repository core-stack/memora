import { SourceEntity } from '@/entities/source.entity';
import { BaseController } from '@/shared/controller';
import { Controller } from '@/shared/decorators/controller';
import { Body, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { FileURLResponseDto } from './dto/file-url-response.dto';
import { GetUploadUrlDto } from './dto/get-upload-url.dto';
import { SourceService } from './source.service';

@Controller('tenant/:tenantId/knowledge/:knowledgeSlug/source')
export class SourceController extends BaseController({
  entity: SourceEntity,
  ignore: ['create', 'update', 'delete'],
}) {
  constructor(public service: SourceService) {
    super(service);
  }

  @Get(":id/view")
  @ApiResponse({ type: FileURLResponseDto, status: 200 })
  async view(@Param("id", ParseUUIDPipe) sourceId: string) {
    return this.service.view(sourceId);
  }

  @Get(":id/download-url")
  @ApiResponse({ type: FileURLResponseDto, status: 200 })
  async download(@Param("id", ParseUUIDPipe) sourceId: string) {
    return this.service.downloadUrl(sourceId);
  }

  @Post("upload-url")
  @ApiResponse({ type: FileURLResponseDto, status: 200 })
  async upload(@Body() body: GetUploadUrlDto) {
    return this.service.getUploadUrl(body);
  }

  @Post(":id/retry")
  @ApiResponse({ type: SourceEntity, status: 200 })
  async retry(@Param("id", ParseUUIDPipe) sourceId: string) {
    return this.service.retryIndex(sourceId);
  }
}
