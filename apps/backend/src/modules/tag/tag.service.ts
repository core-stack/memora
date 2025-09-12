import { TenantService } from '@/generics/tenant.service';
import { Tag } from '@memora/schemas';
import { Injectable } from '@nestjs/common';

import { TagRepository } from './tag.repository';

@Injectable()
export class TagService extends TenantService<Tag> {
  constructor(repository: TagRepository) {
    super(repository);
  }
}
