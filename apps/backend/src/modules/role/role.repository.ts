import { DrizzleGenericRepository } from '@/generics';
import { RoleEntity } from './role.entity';
import { role } from '@/db/schema/role';

export class RoleRepository extends DrizzleGenericRepository<typeof role, RoleEntity> {
  constructor() {
    super(role);
  }
}