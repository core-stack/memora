
import { BaseController } from '@/shared/controller';
import { Controller } from '@/shared/decorators/controller';

import { RoleEntity } from '../../entities/role.entity';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('tenant/:tenantId/role')
export class RoleController extends BaseController({
  entity: RoleEntity,
  createDto: CreateRoleDto,
  updateDto: UpdateRoleDto
}) {
  constructor(service: RoleService) {
    super(service);
  }

}
