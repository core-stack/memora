import { and, eq } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';

import { member } from '@/db/schema/member';
import { role } from '@/db/schema/role';
import { tenant } from '@/db/schema/tenant';
import { user } from '@/db/schema/user';
import { DrizzleGenericRepository } from '@/generics';
import { FilterOptions } from '@/generics/filter-options';
import { RepositoryOptions } from '@/generics/repository.interface';
import { TxType } from '@/infra/database/types';

import { RoleEntity } from '../role/role.entity';
import { TenantEntity } from '../tenant/tenant.entity';
import { UserEntity } from '../user/user.entity';
import { MemberEntity } from './member.entity';

export class MemberRepository extends DrizzleGenericRepository<
  typeof member, MemberEntity
> {
  constructor() {
    super(member);
  }


  async find(opts: FilterOptions<MemberEntity>, repoOpts?: RepositoryOptions<TxType>): Promise<MemberEntity[]> {
    return this.run(async (db) => {
      if (!opts.limit) opts.limit = 1000;
      if (!opts.offset) opts.offset = 0;

      const { filter, order } = this.buildFilter(opts);
     
      const query = db.select().from(this.table as PgTable)
        .where(and(...filter))
        .limit(opts.limit)
        .offset(opts.offset)
        .orderBy(...order);

      if (opts.include?.includes("user")) {
        query.leftJoin(user, eq(user.id, member.userId));
      }
      if (opts.include?.includes("tenant")) {
        query.leftJoin(tenant, eq(tenant.id, member.tenantId));
      }
      if (opts.include?.includes("role")) {
        query.leftJoin(role, eq(role.id, member.roleId));
      }
  
      const rows = await query;
      let results = [] as MemberEntity[];
      if (opts.include && opts.include?.length > 0) {
        results = rows.reduce((acc, row) => {
          const member = row.members as MemberEntity;
          const user = row.users as UserEntity;
          const tenant = row.tenants as TenantEntity;
          const role = row.roles as RoleEntity;
          const index = acc.findIndex(p => p.id === member.id);
          if (index === -1) {
            acc.push({ ...member, user, tenant, role });
          } else {
            acc[index] = { ...member, user, tenant, role };
          }
          return acc;
        }, [] as MemberEntity[]);
      } else {
        results = rows as MemberEntity[];
      }

      return results;
    }, repoOpts);
  }
}