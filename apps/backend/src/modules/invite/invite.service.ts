import { GenericTenantService } from '@/generics/tenant.service';
import { Injectable, Logger } from '@nestjs/common';
import { CreateInviteSchema, InviteSchema } from '@snipet/schemas';

import { CreateInviteEntity, InviteEntity } from './invite.entity';
import { InviteRepository } from './invite.repository';

@Injectable()
export class InviteService extends GenericTenantService<
  InviteSchema, CreateInviteSchema, Partial<InviteSchema>,
  InviteEntity, CreateInviteEntity
> {
  logger = new Logger(InviteService.name);

  constructor(repository: InviteRepository) {
    super(repository);
  }
}
