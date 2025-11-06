import { CrudService } from '@/generics';
import { Injectable } from '@nestjs/common';
import { CreateInviteSchema, InviteSchema } from '@snipet/schemas';

import { CreateInviteEntity, InviteEntity } from './invite.entity';
import { InviteRepository } from './invite.repository';

@Injectable()
export class InviteService extends CrudService<
  InviteSchema, CreateInviteSchema, Partial<InviteSchema>,
  InviteEntity, CreateInviteEntity
> {
  constructor(repository: InviteRepository) {
    super(repository);
  }
}
