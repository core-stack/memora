import { SourceEntity } from '@/entities/source.entity';
import { BaseController } from '@/shared/controller';
import { Controller, HttpGet, HttpPost } from '@/shared/controller/decorators';
import { Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { CreateSourceDto } from './dto/create-source.dto';
import { FileURLResponseDto } from './dto/file-url-response.dto';
import { GetUploadUrlDto } from './dto/get-upload-url.dto';
import { SourceService } from './source.service';

@Controller("tenant/:tenantId/knowledge/:knowledgeId/source")
export class SourceController extends BaseController({
  entity: SourceEntity,
  createDto: CreateSourceDto,
  ignore: [ "update", "delete" ],
  allowedFilters: [ "folderId", "key", "knowledgeId", "tenantId", "sourceType" ]
}) {
  constructor(public service: SourceService) {
    super(service);
  }

  @HttpGet(":id/view")
  @ApiResponse({ type: FileURLResponseDto, status: 200 })
  async view(@Param("id", ParseUUIDPipe) sourceId: string) {
    return this.service.view(sourceId);
  }

  @HttpPost(":id/download-url")
  @ApiResponse({ type: FileURLResponseDto, status: 200 })
  async download(@Param("id", ParseUUIDPipe) sourceId: string) {
    return this.service.downloadUrl(sourceId);
  }

  @HttpPost("upload-url")
  @ApiResponse({ type: FileURLResponseDto, status: 200 })
  async upload(@Body() body: GetUploadUrlDto) {
    return this.service.getUploadUrl(body);
  }

  @HttpPost(":id/retry")
  @ApiResponse({ type: SourceEntity, status: 200 })
  async retry(@Param("id", ParseUUIDPipe) sourceId: string) {
    return this.service.retryIndex(sourceId);
  }
}
