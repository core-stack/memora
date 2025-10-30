import { Injectable } from '@nestjs/common';
import { CreateTag, Tag, UpdateTag } from '@snipet/schemas';

import { TagRepository } from './tag.repository';
import { CrudService } from '@/generics';
import { CreateTagEntity, TagEntity, UpdateTagEntity } from './tag.entity';

@Injectable()
export class TagService extends CrudService<
  Tag, CreateTag, UpdateTag,
  TagEntity, CreateTagEntity, UpdateTagEntity
> {
  constructor(repository: TagRepository) {
    super(repository);
  }
}
