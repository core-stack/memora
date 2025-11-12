import { invite } from '@/db/schema/invite';
import { DrizzleGenericRepository } from '@/generics';
import { RepositoryOptions } from '@/generics/repository.interface';
import { TxType } from '@/infra/database/types';

import { CreateInviteEntity, InviteEntity } from './invite.entity';
import { eq, inArray } from 'drizzle-orm';

export class InviteRepository extends DrizzleGenericRepository<typeof invite, InviteEntity, CreateInviteEntity> {
  constructor() {
    super(invite);
  }

  findByEmail<T extends string | string[]>(
    email: T,
    repoOpts?: RepositoryOptions<TxType>
  ): Promise<T extends string ? InviteEntity | null : InviteEntity[] | null> {
    return this.run(async (db) => {
      const query = db.select().from(invite)
        .where(
          Array.isArray(email)
          ? inArray(invite.email, email)
          : eq(invite.email, email)
        );

      if (!Array.isArray(email)) query.limit(1);

      const selectedInvites = await query;
      if (!selectedInvites || selectedInvites.length === 0) return null as any;
      if (Array.isArray(email)) {
        return selectedInvites;
      }

      return selectedInvites[0];
    }, repoOpts);
  }
}