import { CrudController } from '@/generics';
import { Controller } from '@nestjs/common';
import {
  createTenantSchema, tenantFilterSchema, TenantSchema, updateTenantSchema
} from '@snipet/schemas';

import { TenantService } from './tenant.service';

@Controller('tenant')
export class TenantController extends CrudController<TenantSchema>(
  { filterSchema: tenantFilterSchema, createDtoSchema: createTenantSchema, updateDtoSchema: updateTenantSchema }
) {
  constructor(service: TenantService) {
    super(service);
  }
}
