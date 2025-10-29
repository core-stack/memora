import { user } from '@/db/schema/user';
import { DrizzleGenericRepository } from '@/generics';
import { UserEntity } from './user.entity';

export class UserRepository extends DrizzleGenericRepository<typeof user, UserEntity> {
  constructor() {
    super(user);
  }
}