import { EntityManager } from 'typeorm';

import { FilterOptions } from '@/shared/filter-options';
import { Service } from '@/shared/service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { UserEntity } from './user.entity';

@Injectable()
export class UserService extends Service<UserEntity> {
  entity = UserEntity;
  logger = new Logger(UserService.name);

  async findWithMemberRoleTenant(filterOpts: FilterOptions<UserEntity>, manager?: EntityManager): Promise<UserEntity[]> {
    return await this.repository(manager).find({
      ...filterOpts,
      relations: ['role', 'member', 'member.role', 'member.tenant']
    });
  }

  async findFirstWithMemberRoleTenant(filterOpts: FilterOptions<UserEntity>, manager?: EntityManager): Promise<UserEntity | null> {
    return await this.repository(manager).find({
      ...filterOpts,
      relations: ['role', 'member', 'member.role', 'member.tenant'],
      take: 1
    })[0];
  }

  async self() {
    if (!this.context.session?.user.id) throw new UnauthorizedException();
    return await this.findFirstWithMemberRoleTenant({ where: { id: this.context.session.user.id }});
  }
}
