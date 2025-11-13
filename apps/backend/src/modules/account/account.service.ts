import { EntityManager } from 'typeorm';

import { Service } from '@/shared/service';
import { Inject, Injectable } from '@nestjs/common';
import { AccountSchema } from '@snipet/schemas';

import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';
import { AccountEntity } from './account.entity';
import { AccountRepository } from './account.repository';
import { CreateAccountDto } from './dto/crete-account.dto';

@Injectable()
export class AccountService extends Service<AccountEntity> {
  entity = AccountEntity;

  @Inject() private readonly userService: UserService;
  @Inject() private readonly roleService: RoleService;

  // async createIfNotExists(data: CreateAccountDto, manager?: EntityManager): Promise<AccountSchema> {
  //   return this.transaction(async (manager) => {

  //     // get user by email
  //     const userWithEmail = await this.userService.findUnique({ where: { email: data.email } });

  //     // if user not found, create user with user role
  //     if (!userWithEmail) {

  //     }
  //     // create account
  //   }, manager);
  // }
}
