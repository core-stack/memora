import { invite } from '@/db/schema/invite';
import { DrizzleGenericRepository } from '@/generics';

import { CreateInviteEntity, InviteEntity } from './invite.entity';

export class InviteRepository extends DrizzleGenericRepository<
  typeof invite, InviteEntity, CreateInviteEntity
> {
  constructor() {
    super(invite);
  }
}