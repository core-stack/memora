import { Logger } from '@nestjs/common';

import { FilterOptions } from './filter-options';
import { CrudService } from './service';
import { ServiceOptions } from './service.interface';

export abstract class GenericTenantService<
  TSchema,
  TCreateDto = Partial<TSchema>,
  TUpdateDto = Partial<TSchema>,
  TEntity extends { tenantId: string | null } = TSchema & { tenantId: string | null },
  TCreateEntity = TCreateDto,
  TUpdateEntity = TUpdateDto
> extends CrudService<TSchema, TCreateDto, TUpdateDto, TEntity, TCreateEntity, TUpdateEntity> {
  abstract readonly logger: Logger;

  override async find(filterOptions: FilterOptions<TSchema>, opts?: ServiceOptions): Promise<TSchema[]> {
    const tenantId = this.getTenantId(opts);
    if (!tenantId) {
      this.logger.warn('Tentando realizar find sem tenantId');
      return [];
    }

    return super.find(
      { ...filterOptions, filter: { ...(filterOptions.filter as Partial<TSchema>), tenantId } },
      opts,
    );
  }

  override async create(
    input: Omit<TCreateDto, 'tenantId'> | Omit<TCreateEntity, 'tenantId'>,
    opts?: ServiceOptions,
  ): Promise<TSchema> {
    const tenantId = this.getTenantId(opts);
    this.logger.debug(`Creating with tenantId: ${tenantId}`);

    return super.create({ ...input, tenantId } as TCreateEntity, opts);
  }

  override async update(
    id: string,
    input: Omit<TUpdateDto, 'tenantId'> | Omit<TUpdateEntity, 'tenantId'>,
    opts?: ServiceOptions,
  ): Promise<void> {
    const tenantId = this.getTenantId(opts);
    this.logger.debug(`Updating ${id} with tenantId: ${tenantId}`);

    return super.update(id, { ...input, tenantId } as TUpdateEntity, opts);
  }

  protected getTenantId(opts?: ServiceOptions): string | undefined {
    if (!opts?.http) {
      this.logger.warn('HttpContext not found — tenantId not found');
      return undefined;
    }

    const tenantId = opts.http.params.shouldGetString("tenantId");
    if (!tenantId) {
      this.logger.warn('TenantId not found in params');
    }

    return tenantId;
  }
}
