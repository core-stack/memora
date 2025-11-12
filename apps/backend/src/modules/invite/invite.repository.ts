import { invite } from '@/db/schema/invite';
import { DrizzleGenericRepository } from '@/generics';
import { RepositoryOptions } from '@/generics/repository.interface';
import { TxType } from '@/infra/database/types';

import { CreateInviteEntity, InviteEntity } from './invite.entity';

export class InviteRepository extends DrizzleGenericRepository<typeof invite, InviteEntity, CreateInviteEntity> {
  constructor() {
    super(invite);
  }

  async createMany(data: CreateInviteEntity, repoOpts?: RepositoryOptions<TxType>): Promise<InviteEntity[]> {
    return this.run(async (db) => {
      db.insert(invite).values({  }).returning();
    }, repoOpts, true);
  }
}