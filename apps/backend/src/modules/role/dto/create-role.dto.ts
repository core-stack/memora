import { RoleEntity } from '@/entities';
import { PickType } from '@nestjs/swagger';

export class CreateRoleDto extends PickType(RoleEntity, [ 'name', 'permissions', 'key']) {}