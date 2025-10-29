import { TenantService } from '@/generics/tenant.service';
import { Injectable } from '@nestjs/common';
import { UserSchema } from '@snipet/schemas';

import { UserRepository } from './user.repository';
import { CrudService } from '@/generics';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService extends CrudService<UserSchema> {
  constructor(repository: UserRepository) {
    super(repository);
  }

  override toSchema<UserEntity>(entity: UserEntity): UserEntity;
  override toSchema<UserEntity>(entity: UserEntity[]): UserEntity[];
  override toSchema(entity: UserEntity | UserEntity[]): UserSchema | UserSchema[] {
    if (Array.isArray(entity)) {
      return entity.map(({ password, ...user }) => ({ ...user }));
    }
    const { password, ...user } = entity;
    return user;
  }
}
