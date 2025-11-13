import { FilterOptions } from '@/generics/filter-options';
import { Service } from '@/shared/service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserEntity } from './user.entity';

@Injectable()
export class UserService extends Service<UserEntity> {
  entity = UserEntity;

  async findWithMemberRoleTenant(filterOpts: FilterOptions<UserEntity>): Promise<UserEntity[]> {
    return await this.repository().find({
      ...filterOpts,
      relations: ['role', 'member', 'member.role', 'member.tenant']
    });
  }

  async findFirstWithMemberRoleTenant(filterOpts: FilterOptions<UserEntity>): Promise<UserEntity | null> {
    return await this.repository().find({
      ...filterOpts,
      relations: ['role', 'member', 'member.role', 'member.tenant'],
      take: 1
    })[0];
  }

  async self() {
    if (!this.context.session?.user.id) throw new UnauthorizedException();
    return await this.findFirstWithMemberRoleTenant({ filter: { id: this.context.session.user.id }});
  }
}
