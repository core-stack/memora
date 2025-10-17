import { TenantService } from '@/generics/tenant.service';
import { Injectable } from '@nestjs/common';
import { Tag } from '@snipet/schemas';

import { TagRepository } from './tag.repository';

@Injectable()
export class TagService extends TenantService<Tag> {
  constructor(repository: TagRepository) {
    super(repository);
  }
}
