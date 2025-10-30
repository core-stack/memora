import { Injectable } from '@nestjs/common';
import { UserSchema } from '@snipet/schemas';

import { UserRepository } from './user.repository';
import { CrudService } from '@/generics';
import { CreateUserEntity, UpdateUserEntity, UserEntity } from './user.entity';
import { FilterOptions } from '@/generics/filter-options';
import { ServiceOptions } from '@/generics/service.interface';

@Injectable()
export class UserService extends CrudService<
  UserSchema, CreateUserEntity, UpdateUserEntity,
  UserEntity, CreateUserEntity, UpdateUserEntity
> {
  constructor(protected repository: UserRepository) {
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

  async findWithMemberRoleTenant(filterOpts: FilterOptions<UserEntity>, opts?: ServiceOptions) {
    return await this.repository.findWithMemberRoleTenant(filterOpts, { tx: opts?.tx });
  }

  async findFirstWithMemberRoleTenant(filterOpts: FilterOptions<UserEntity>, opts?: ServiceOptions) {
    return await this.repository.findFirstWithMemberRoleTenant(filterOpts, { tx: opts?.tx });
  }
}
