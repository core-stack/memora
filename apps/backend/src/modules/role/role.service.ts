import { Service } from '@/shared/service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { permissionsToNumber, ROLES } from '@snipet/permission';

import { RoleEntity, RoleScope } from '../../entities/role.entity';

@Injectable()
export class RoleService extends Service<RoleEntity> implements OnModuleInit {
  entity = RoleEntity;
  logger = new Logger(RoleService.name);

  async onModuleInit() {
    const existingGlobalRoles = await this.repository().find({ where: { scope: RoleScope.GLOBAL } });
    // create default global roles  
    for (const role of ROLES.global.default) {
      const existing = existingGlobalRoles.find(r => r.key === role.key);
      if (!existing) {
        await this.repository().save(RoleEntity.fromRoleSchema(role));
        this.logger.verbose(`Created new role ${role.key}`);
      } else {
        if (existing.name === role.name && existing.permissions === permissionsToNumber(role.permissions)) continue;
        await this.repository().update(existing.id, {
          name: role.name,
          permissions: permissionsToNumber(role.permissions)
        });
        this.logger.verbose(`Updated role ${role.key}`);
      }
    }
  }
}
