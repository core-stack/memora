import { DrizzleGenericRepository } from '@/generics';
import { CreateVerificationTokenEntity, UpdateVerificationTokenEntity, VerificationTokenEntity } from './verification-token.entity';
import { verificationToken } from '@/db/schema';
import { FilterOptions } from '@/generics/filter-options';
import { RepositoryOptions } from '@/generics/repository.interface';
import { NonUniqueError } from '@/infra/database/errors/non-unique.error';
import { TxType } from '@/infra/database/types';
import { and, eq } from 'drizzle-orm';
import { user } from '@/db/schema/user';
import { UserEntity } from '../user/user.entity';

export class VerificationTokenRepository extends DrizzleGenericRepository<
  typeof verificationToken,
  VerificationTokenEntity,
  CreateVerificationTokenEntity,
  UpdateVerificationTokenEntity
> {
  constructor() {
    super(verificationToken, "token");
  }

  async findUniqueWithUser(
    opts: FilterOptions<VerificationTokenEntity>,
    repoOpts?: RepositoryOptions<TxType>
  ): Promise<VerificationTokenEntity & { user: UserEntity } | null> {
    return this.run(async (db) => {
      opts.limit = 2;
      opts.offset = 0;

      const { filter, order } = this.buildFilter(opts);
      const results = await db.select().from(verificationToken)
        .leftJoin(user, eq(user.id, verificationToken.userId))
        .where(and(...filter))
        .limit(opts.limit)
        .offset(opts.offset)
        .orderBy(...order);

      const result = results.at(0);
      if (!result) return null;
      if (results.length > 1) throw new NonUniqueError("Multiple results found");

      return {
        ...result.verification_tokens,
        user: result.users
      } as VerificationTokenEntity & { user: UserEntity };
    }, repoOpts);
  }
}