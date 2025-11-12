import { CrudService } from '@/generics';
import { FilterOptions } from '@/generics/filter-options';
import { ServiceOptions } from '@/generics/service.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserSchema } from '@snipet/schemas';

import { CreateUserEntity, UpdateUserEntity, UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends CrudService<
  UserSchema, CreateUserEntity, UpdateUserEntity,
  UserEntity, CreateUserEntity, UpdateUserEntity
> {
  constructor(protected repository: UserRepository) {
    super(repository);
  }

  toSchema(entity: null): null
  toSchema(entity: UserEntity): UserSchema
  toSchema(entity: UserEntity[]): UserSchema[]
  override toSchema(entity: UserEntity | null |  UserEntity[]): UserSchema | null | UserSchema[] {
    if (!entity) return null;
    if (Array.isArray(entity)) {
      return entity.map(({ password, ...u}) => u);
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

  async self(opts: ServiceOptions) {
    if (!opts.http) throw new Error("http context is required");
    if (!opts.http.auth.session) throw new UnauthorizedException();
    const res = await this.repository.findFirstWithMemberRoleTenant(
      { filter: { id: opts.http.auth.session.user.id }}, opts
    )
    return this.toSchema(res as UserEntity);
  }
}
