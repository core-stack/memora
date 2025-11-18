
import { BaseController } from '@/shared/controller';
import { Controller } from '@nestjs/common';

import { RoleEntity } from '../../entities/role.entity';
import { RoleService } from './role.service';

@Controller('tenant/:tenantId/role')
export class RoleController extends BaseController({ entity: RoleEntity }) {
  constructor(service: RoleService) {
    super(service);
  }
}
