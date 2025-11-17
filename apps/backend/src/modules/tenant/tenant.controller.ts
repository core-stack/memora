import { BaseController } from '@/shared/controller';
import { Controller } from '@nestjs/common';

import { TenantEntity } from '../../entities/tenant.entity';
import { TenantService } from './tenant.service';

@Controller('tenant')
export class TenantController extends BaseController<TenantEntity>({  ignore: ["create"] }) {
  constructor(service: TenantService) {
    super(service);
  }
}
