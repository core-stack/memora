import { tag } from '@/db/schema';
import { DrizzleGenericRepository } from '@/generics';
import { CreateTenantEntity, TenantEntity, UpdateTenantEntity } from './tenant.entity';

export class TenantRepository extends DrizzleGenericRepository<
  typeof tag, TenantEntity, CreateTenantEntity, UpdateTenantEntity
> {
  constructor() {
    super(tag);
  }
}