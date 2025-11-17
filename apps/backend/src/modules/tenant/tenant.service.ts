import { EntityManager } from 'typeorm';

import { Service } from '@/shared/service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { permissionsToNumber, ROLES } from '@snipet/permission';

import { MemberEntity } from '../../entities/member.entity';
import { RoleEntity, RoleScope } from '../../entities/role.entity';
import { TenantEntity } from '../../entities/tenant.entity';
import { AuthManager } from '../auth/auth-manager.service';
import { MemberService } from '../member/member.service';

@Injectable()
export class TenantService extends Service<TenantEntity> {
  entity = TenantEntity;
  logger = new Logger(TenantService.name);

  @Inject() private readonly authManager: AuthManager;
  @Inject() private readonly memberService: MemberService;

  override async create(input: TenantEntity, manager?: EntityManager): Promise<TenantEntity> {
    input.roles = ROLES.tenant.default.map((r) =>
      new RoleEntity({
        key: r.key,
        name: r.name,
        permissions: permissionsToNumber(r.permissions),
        scope: RoleScope.TENANT,
      })
    );

    return this.transaction(async (manager) => {
      const tenant = await this.repository(manager).save(input);
      tenant.members = [
        new MemberEntity({
          roleId: tenant.roles?.find(r => r.key === ROLES.tenant.admin.key)?.id!,
          owner: true,
          tenantId: tenant.id,
          userId: this.context.user?.id!,
        })
      ]
      await this.memberService.create(tenant.members![0], manager);
      await this.authManager.reloadSession(this.context.session!.id);
      return tenant;
    }, manager);
  }
}
