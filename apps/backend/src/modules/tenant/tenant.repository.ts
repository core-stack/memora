import { DrizzleGenericRepository } from '@/generics';
import { CreateTenantEntity, TenantEntity, UpdateTenantEntity } from './tenant.entity';
import { UserEntity } from '../user/user.entity';
import { RepositoryOptions } from '@/generics/repository.interface';
import { TxType } from '@/infra/database/types';
import { tenant } from '@/db/schema/tenant';

export class TenantRepository extends DrizzleGenericRepository<
  typeof tenant, TenantEntity, CreateTenantEntity, UpdateTenantEntity
> {
  constructor() {
    super(tenant);
  }
}