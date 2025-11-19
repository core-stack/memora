import { BaseController } from '@/shared/controller';
import { Controller } from '@/shared/decorators/controller';

import { TenantEntity } from '../../entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantService } from './tenant.service';

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
