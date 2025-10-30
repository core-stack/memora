import { DrizzleGenericRepository } from '@/generics';
import { AccountEntity, CreateAccountEntity } from './account.entity';
import { account } from '@/db/schema/account';
import { RepositoryOptions } from '@/generics/repository.interface';
import { TxType } from '@/infra/database/types';
import { user } from '@/db/schema/user';
import { eq } from 'drizzle-orm';
import { UserEntity } from '../user/user.entity';
import e from 'express';

export class AccountRepository extends DrizzleGenericRepository<
  typeof account, AccountEntity
> {
  constructor() {
    super(account);
  }

  async createIfNotExists(data: CreateAccountEntity, opts: RepositoryOptions<TxType>): Promise<AccountEntity> {
    return this.run(async (db) => {
      const userList = await db.select().from(user).where(eq(user.email, data.email));
      let userData: UserEntity;
      if (userList.length === 0) {
        const [created] = await db.insert(user).values({
          roleId: "",
          email: data.email,
          name: data.name,
          image: data.image,
          emailVerified: data.emailVerified ? new Date() : undefined,
        }).returning();
        userData = created as UserEntity;
      } else {
        userData = userList[0] as UserEntity;
      }

      const [created] = await db.insert(account).values({
        userId: userData.id,
        provider: data.provider,
        providerAccountId: data.providerAccountId
      }).returning();
      return created as AccountEntity;
    }, opts);
  }
}