import { Injectable } from '@nestjs/common';
import { CreateTenantSchema, TenantSchema, UpdateTenantSchema } from '@snipet/schemas';

import { TenantRepository } from './tenant.repository';
import { CrudService } from '@/generics';
import { CreateTenantEntity, TenantEntity, UpdateTenantEntity } from './tenant.entity';
import { ServiceOptions } from '@/generics/service.interface';
import { AuthManager } from '../auth/auth-manager.service';
import { TxManager } from '@/generics/tx-manager';

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
    return this.txManager.runOrCreate(opts?.tx, async (tx) => {
      const tenant = await super.create(input, { ...opts, tx });
      await this.authManager.reloadSession(opts?.http?.auth.session?.id!);
      return tenant;
    });
  }
}
