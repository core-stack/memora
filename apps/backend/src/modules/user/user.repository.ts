import { user } from '@/db/schema/user';
import { DrizzleGenericRepository } from '@/generics';
import { CreateUserEntity, UpdateUserEntity, UserEntity } from './user.entity';
import { FilterOptions } from '@/generics/filter-options';
import { RepositoryOptions } from '@/generics/repository.interface';
import { TxType } from '@/infra/database/types';
import { alias } from 'drizzle-orm/pg-core';
import { and, eq } from 'drizzle-orm';
import { member } from '@/db/schema/member';
import { tenant } from '@/db/schema/tenant';
import { role } from '@/db/schema/role';
import { TenantEntity } from '../tenant/tenant.entity';
import { MemberEntity } from '../member/member.entity';
import { RoleEntity } from '../role/role.entity';


export type UserWithMemberRoleTenant = UserEntity & {
  members: Array<MemberEntity & { tenant: TenantEntity; role: RoleEntity }>;
  role: RoleEntity;
}
export class UserRepository extends DrizzleGenericRepository<
  typeof user,
  UserEntity,
  CreateUserEntity,
  UpdateUserEntity
> {
  constructor() {
    super(user);
  }

  findWithMemberRoleTenant(
    opts: FilterOptions<UserEntity>,
    repoOpts?: RepositoryOptions<TxType>
  ): Promise<UserWithMemberRoleTenant[]> {
    return this.run(async (db) => {
      if (!opts.limit) opts.limit = 1000;
      if (!opts.offset) opts.offset = 0;

      const { filter, order } = this.buildFilter(opts);

      const roleMember = alias(role, "role_member");
      const roleUser = alias(role, "role_user");

      const rows = await db.select().from(user)
        .leftJoin(member, eq(member.userId, user.id))
        .leftJoin(tenant, eq(tenant.id, member.tenantId))
        .leftJoin(roleMember, eq(roleMember.id, member.roleId))
        .leftJoin(roleUser, eq(roleUser.id, user.roleId))
        .where(and(...filter))
        .limit(opts.limit)
        .offset(opts.offset)
        .orderBy(...order);

      const users = Object.values(
        rows.reduce((acc, row) => {
          const userId = row.users.id;
          let userIndex = acc.findIndex(u => u.id === userId);
          if (userIndex === -1) {
            acc.push({
              id: row.users.id,
              email: row.users.email!,
              name: row.users.name ?? "",
              createdAt: row.users.createdAt!,
              password: row.users.password ?? "",
              emailVerified: row.users.emailVerified ?? undefined,
              image: row.users.image ?? "",
              roleId: row.users.roleId,
              updatedAt: row.users.updatedAt ?? undefined,
              members: [],
              role: row.role_user!,
            });
            userIndex = acc.length - 1;
          }

          if (row.members) {
            const existingMember = acc[userIndex].members.find((m: MemberEntity) => m.id === row.members?.id);
            if (!existingMember) acc[userIndex].members.push({
              id: row.members.id,
              tenantId: row.members.tenantId,
              userId: row.members.userId,
              role: row.role_member!,
              tenant: {
                name: row.tenants!.name,
                backgroundImage: row.tenants!.backgroundImage,
                createdAt: row.tenants!.createdAt!,
                description: row.tenants!.description ?? undefined,
                disabledAt: row.tenants!.disabledAt ?? undefined,
                id: row.tenants!.id,
                updatedAt: row.tenants!.updatedAt ?? undefined
              },
              roleId: row.members.roleId,
              createdAt: row.members.createdAt!,
              updatedAt: row.members.updatedAt ?? undefined
            });
          }

          return acc;
        }, [] as Array<UserWithMemberRoleTenant>)
      );
      return users;
    }, repoOpts);
  }

  async findFirstWithMemberRoleTenant(
    opts: FilterOptions<UserEntity>,
    repoOpts?: RepositoryOptions<TxType>
  ): Promise<UserWithMemberRoleTenant | null> {
    return (await this.findWithMemberRoleTenant({ ...opts, limit: 1 }, repoOpts)).at(0) ?? null;
  }
}