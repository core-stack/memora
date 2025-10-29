import { Injectable } from '@nestjs/common';
import { UserSchema } from '@snipet/schemas';

import { UserRepository } from './user.repository';
import { CrudService } from '@/generics';
import { CreateUserEntity, UpdateUserEntity, UserEntity } from './user.entity';

@Injectable()
export class UserService extends CrudService<
  UserSchema, CreateUserEntity, UpdateUserEntity,
  UserEntity, CreateUserEntity, UpdateUserEntity
> {
  constructor(repository: UserRepository) {
    super(repository);
  }

  override toSchema<UserEntity>(entity: UserEntity): UserSchema;
  override toSchema<UserEntity>(entity: UserEntity[]): UserSchema[];
  override toSchema(entity: UserEntity | UserEntity[]): UserSchema | UserSchema[] {
    if (Array.isArray(entity)) {
      return entity.map(({ password, ...user }) => ({ ...user }));
    }
    const { password, ...user } = entity;
    return user;
  }
}
