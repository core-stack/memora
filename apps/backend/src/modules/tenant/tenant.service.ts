import { Injectable } from '@nestjs/common';
import { CreateTenantSchema, TenantSchema, UpdateTenantSchema } from '@snipet/schemas';

import { TenantRepository } from './tenant.repository';
import { CrudService } from '@/generics';
import { CreateTenantEntity, TenantEntity, UpdateTenantEntity } from './tenant.entity';

@Injectable()
export class TenantService extends CrudService<
  TenantSchema, CreateTenantSchema, UpdateTenantSchema,
  TenantEntity, CreateTenantEntity, UpdateTenantEntity
> {
  constructor(repository: TenantRepository) {
    super(repository);
  }
}
