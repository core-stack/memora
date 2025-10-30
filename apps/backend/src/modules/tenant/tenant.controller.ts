import { CrudController } from '@/generics';
import { Controller } from '@nestjs/common';
import { createTenantSchema, TenantSchema, tagFilterSchema, updateTenantSchema, tenantFilterSchema } from '@snipet/schemas';

import { TenantService } from './tenant.service';

@Controller('tenant')
export class TenantController extends CrudController<TenantSchema>(
  tenantFilterSchema, createTenantSchema, updateTenantSchema
) {
  constructor(service: TenantService) {
    super(service);
  }
}
