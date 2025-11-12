import { eq } from 'drizzle-orm';

import { account } from '@/db/schema/account';
import { user } from '@/db/schema/user';
import { DrizzleGenericRepository } from '@/generics';
import { RepositoryOptions } from '@/generics/repository.interface';
import { TxType } from '@/infra/database/types';
import { NotFoundException } from '@nestjs/common';
import { ROLES } from '@snipet/permission';

import { RoleService } from '../role/role.service';
import { AccountEntity, CreateAccountEntity } from './account.entity';
import { Repository } from 'typeorm';

export class AccountRepository extends Repository<AccountEntity> {

  async createIfNotExists(data: CreateAccountEntity, opts: RepositoryOptions<TxType>): Promise<AccountEntity> {
    return this.run(async (db) => {
      const userList = await db.select().from(user).where(eq(user.email, data.email));
      let userData: UserEntity;
      if (userList.length === 0) {
        const role = await this.roleService.findUnique({ filter: { key: ROLES.global.user.key, scope: "GLOBAL" } });
        if (!role) throw new NotFoundException("Role not found");
        const [created] = await db.insert(user).values({
          roleId: role.id,
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