import { eq } from 'drizzle-orm';

import { member } from '@/db/schema/member';
import { role } from '@/db/schema/role';
import { tenant } from '@/db/schema/tenant';
import { DrizzleGenericRepository } from '@/generics';
import { RepositoryOptions } from '@/generics/repository.interface';
import { NotFoundError } from '@/infra/database/errors/not-found.error';
import { TxType } from '@/infra/database/types';
import { permissionsToNumber, ROLES } from '@snipet/permission';

import { CreateTenantEntity, TenantEntity, UpdateTenantEntity } from './tenant.entity';

export class TenantRepository extends DrizzleGenericRepository<
  typeof tenant, TenantEntity, CreateTenantEntity, UpdateTenantEntity
> {
  constructor() {
    super(tenant);
  }

  override async create(data: CreateTenantEntity, repoOpts?: RepositoryOptions<TxType>): Promise<TenantEntity> {
    return this.run(async (db) => {
      const [createdTenant] = await db.insert(tenant).values({
        name: data.name,
        description: data.description,
        backgroundImage: data.backgroundImage || "",
      }).returning();
      
      await db.insert(role).values(data.defaultRoles.map(role => ({
        key: role.key,
        name: role.name,
        tenantId: createdTenant.id,
        permissions: permissionsToNumber(role.permissions),
      })));

      const tenantRoles = await db.select().from(role).where(eq(role.tenantId, createdTenant.id));
      const adminRole = tenantRoles.find(r => r.key === ROLES.tenant.admin.key);
      
      if (!adminRole) throw new NotFoundError("Admin role not found");

      await db.insert(member).values({
        tenantId: createdTenant.id,
        userId: data.userId,
        roleId: adminRole?.id, 
      })
      return createdTenant as TenantEntity;
    }, repoOpts, true);
  }
}