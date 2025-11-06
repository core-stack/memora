import { CrudService } from '@/generics';
import { ServiceOptions } from '@/generics/service.interface';
import { TxManager } from '@/generics/tx-manager';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ROLES } from '@snipet/permission';
import { CreateTenantSchema, TenantSchema, UpdateTenantSchema } from '@snipet/schemas';

import { AuthManager } from '../auth/auth-manager.service';
import { CreateTenantEntity, TenantEntity, UpdateTenantEntity } from './tenant.entity';
import { TenantRepository } from './tenant.repository';

@Injectable()
export class TenantService extends CrudService<
  TenantSchema, CreateTenantSchema, UpdateTenantSchema,
  TenantEntity, CreateTenantEntity, UpdateTenantEntity
> {
  constructor(
    protected readonly repository: TenantRepository,
    private readonly authManager: AuthManager,
    private readonly txManager: TxManager
  ) {
    super(repository);
  }

  override async create(input: CreateTenantSchema, opts?: ServiceOptions): Promise<TenantSchema> {
    if (!opts?.http?.auth.session) throw new InternalServerErrorException("Error getting user info");
    return this.txManager.runOrCreate(opts?.tx, async (tx) => {
      const tenant = await super.create({
        name: input.name,
        description: input.description,
        backgroundImage: input.backgroundImage,
        userId: opts.http!.auth.session!.user.id,
        defaultRoles: ROLES.tenant.default
      }, { ...opts, tx });
      await this.authManager.reloadSession(opts?.http?.auth.session?.id!);
      opts.http?.setCookie("tenant-id", tenant.id);
      return tenant;
    });
  }
}
