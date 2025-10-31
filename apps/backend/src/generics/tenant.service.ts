import { Logger } from "@nestjs/common";
import { CrudService } from "./service";
import { ServiceOptions } from "./service.interface";

export abstract class GenericTenantService<
  TSchema,
  TCreateDto = Partial<TSchema>,
  TUpdateDto = Partial<TSchema>,
  TEntity = TSchema,
  TCreateEntity = TCreateDto,
  TUpdateEntity = TUpdateDto
> extends CrudService<TSchema, TCreateDto, TUpdateDto, TEntity, TCreateEntity, TUpdateEntity> {
  abstract readonly logger: Logger;

  override create(
    input: Omit<TCreateDto, "tenantId"> | Omit<TCreateEntity, "tenantId">,
    opts?: ServiceOptions
  ): Promise<TSchema> {
    return super.create({ ...input, tenantId: this.getTenantId(opts) } as TCreateEntity, opts);
  }

  override update(
    id: string,
    input: Omit<TUpdateDto, "tenantId"> | Omit<TUpdateEntity, "tenantId">,
    opts?: ServiceOptions
  ): Promise<void> {
    return super.update(id, { ...input, tenantId: this.getTenantId(opts) } as TUpdateEntity, opts);
  }

  protected getTenantId(opts?: ServiceOptions) {
    if (!opts?.http) this.logger.warn(`HttpContext not found, but is required to get tenantId`);

    const tenantId = opts?.http?.getCookie("tenant-id");
    if (!tenantId) this.logger.warn(`TenantId not found`);

    return opts?.http?.getCookie("tenant-id");
  }
}