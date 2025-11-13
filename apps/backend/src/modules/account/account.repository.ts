import { eq } from 'drizzle-orm';
import { EntityManager, Repository } from 'typeorm';

import { account } from '@/db/schema/account';
import { user } from '@/db/schema/user';
import { NotFoundException } from '@nestjs/common';
import { ROLES } from '@snipet/permission';

import { AccountEntity, CreateAccountEntity } from './account.entity';

export class AccountRepository extends Repository<AccountEntity> {

  async createIfNotExists(data: CreateAccountEntity, manager?: EntityManager): Promise<AccountEntity> {
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