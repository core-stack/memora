import { EntityManager } from "typeorm";

import { Service } from "@/shared/service";
import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ROLES } from "@snipet/permission";

import { AccountEntity } from "../../entities/account.entity";
import { RoleScope } from "../../entities/role.entity";
import { UserEntity } from "../../entities/user.entity";
import { RoleService } from "../role/role.service";
import { UserService } from "../user/user.service";
import { CreateAccountDto } from "./dto/crete-account.dto";

@Injectable()
export class AccountService extends Service<AccountEntity> {
  entity = AccountEntity;
  logger = new Logger(AccountService.name);

  @Inject() private readonly userService: UserService;
  @Inject() private readonly roleService: RoleService;

  async createIfNotExists(data: CreateAccountDto, manager?: EntityManager): Promise<AccountEntity> {
    return this.transaction(async (manager) => {
      // get account
      const account = await this.repository(manager).findOne({
        where: { user: { email: data.email } },
        relations: [ "user" ]
      });
      if (account) return account;

      // get user by email
      const user = await this.userService.findUnique({ where: { email: data.email } });
      // if user not found, create user with user role and account
      if (!user) {
        const role = await this.roleService.findUnique({
          where: { key: ROLES.global.user.key, scope: RoleScope.GLOBAL }
        }, manager);

        if (!role) throw new NotFoundException("Role not found");
        return this.repository(manager).save(new AccountEntity({
          provider: data.provider,
          providerAccountId: data.providerAccountId,
          user: new UserEntity({
            name: data.name,
            email: data.email,
            image: data.image,
            roleId: role.id,
            emailVerified: data.emailVerified ? new Date() : undefined
          })
        }));
      }
      // create account
      return await this.repository(manager).save(new AccountEntity({
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        userId: user.id
      }));
    }, manager);
  }
}
