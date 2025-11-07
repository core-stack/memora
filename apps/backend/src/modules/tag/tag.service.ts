import { GenericTenantService } from '@/generics/tenant.service';
import { Injectable, Logger } from '@nestjs/common';
import { CreateTag, Tag, UpdateTag } from '@snipet/schemas';

import { CreateTagEntity, TagEntity, UpdateTagEntity } from './tag.entity';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService extends GenericTenantService<
  Tag, CreateTag, UpdateTag,
  TagEntity, CreateTagEntity, UpdateTagEntity
> {
  logger = new Logger(TagService.name);
  constructor(repository: TagRepository) {
    super(repository);
  }
}
