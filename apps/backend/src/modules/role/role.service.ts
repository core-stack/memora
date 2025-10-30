import { Injectable } from '@nestjs/common';
import { RoleSchema } from '@snipet/schemas';

import { RoleRepository } from './role.repository';
import { CrudService } from '@/generics';
import {  RoleEntity } from './role.entity';

@Injectable()
export class RoleService extends CrudService<
  RoleSchema, Partial<RoleSchema>, Partial<RoleSchema>,
  RoleEntity
> {
  constructor(repository: RoleRepository) {
    super(repository);
  }
}
