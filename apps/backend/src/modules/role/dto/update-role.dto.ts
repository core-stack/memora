import { RoleEntity } from '@/entities';
import { PickType } from '@nestjs/swagger';

export class UpdateRoleDto extends PickType(RoleEntity, [ 'name', 'permissions', 'key' ]) {}