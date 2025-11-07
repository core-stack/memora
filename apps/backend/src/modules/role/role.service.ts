import { GenericTenantService } from '@/generics/tenant.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { permissionsToNumber, ROLES } from '@snipet/permission';
import { RoleSchema } from '@snipet/schemas';

import { RoleEntity } from './role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService extends GenericTenantService<
  RoleSchema, Partial<RoleSchema>, Partial<RoleSchema>,
  RoleEntity
> implements OnModuleInit {
  logger = new Logger(RoleService.name);
  constructor(protected repository: RoleRepository) {
    super(repository);
  }

  async onModuleInit() {
    const existingGlobalRoles = await this.repository.find({ filter: { scope: "GLOBAL" } });
    for (const role of ROLES.global.default) {
      const existing = existingGlobalRoles.find(r => r.key === role.key);
      if (!existing) {
        await this.repository.create({
          key: role.key,
          name: role.name,
          permissions: permissionsToNumber(role.permissions),
          scope: "GLOBAL"
        });
        this.logger.verbose(`Created role ${role.key}`);
      } else {
        if (existing.name === role.name || existing.permissions === permissionsToNumber(role.permissions)) continue;
        await this.repository.update(existing.id, {
          name: role.name,
          permissions: permissionsToNumber(role.permissions)
        });
        this.logger.verbose(`Updated role ${role.key}`);
      }
    }
  }
}
