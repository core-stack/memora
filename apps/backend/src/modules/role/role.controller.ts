import { CrudController } from '@/generics';
import { Controller } from '@nestjs/common';
import { roleFilterSchema, RoleSchema } from '@snipet/schemas';

import { RoleService } from './role.service';

@Controller('role')
export class RoleController extends CrudController<RoleSchema>({ filterSchema: roleFilterSchema }) {
  constructor(service: RoleService) {
    super(service);
  }
}
