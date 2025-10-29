import { user } from '@/db/schema/user';
import { DrizzleGenericRepository } from '@/generics';
import { CreateUserEntity, UpdateUserEntity, UserEntity } from './user.entity';

export class UserRepository extends DrizzleGenericRepository<
  typeof user,
  UserEntity,
  CreateUserEntity,
  UpdateUserEntity
> {
  constructor() {
    super(user);
  }
}