import { BaseController } from '@/shared/controller';
import { Controller } from '@nestjs/common';

import { TenantEntity } from '../../entities/tenant.entity';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Controller('tenant')
export class TenantController extends BaseController({
  entity: TenantEntity,
  createDto: CreateTenantDto,
  ignore: [ 'update' ]
}) {
  constructor(service: TenantService) {
    super(service);
  }
}
